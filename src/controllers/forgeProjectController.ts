import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as toml from "toml";
import * as cp from "child_process";
import * as net from "net";
import {
	ABI,
	Config,
	ForkDetails,
	TestFile,
	ForkInfo,
	CustomTaskDefinition,
	TestExecutionResponse,
	DeployContract,
	DeployedContract,
	Account,
	ImportedAccounts,
	ScriptResponse,
} from "../types";
import { FoundryTaskProvider } from "../providers/taskProvider";
import { CockPitLogProvider } from "../providers/logProvider";
import { DEFAULT_ANVIL_ACCOUNTS, fileExists, ForgeCockpitCommand, readAccounts } from "../utils";
import { checksumAddress } from "viem";

export class FoundryProjectController {
	private workspaceRoot: vscode.Uri | undefined;
	public isFoundryProject: boolean = false;
	private fileWatchers: vscode.FileSystemWatcher[] = [];
	private buildInProgress: boolean = false;
	private buildQueue: boolean = false;
	private debounceTimer: NodeJS.Timeout | undefined;
	private _onDidBuildSucceed: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidBuildSucceed: vscode.Event<void> = this._onDidBuildSucceed.event;
	private taskProvider: FoundryTaskProvider;
	private taskProviderDisposable: vscode.Disposable | undefined;
	private accounts: Array<Account> = [];
	public config: Config = {
		verbosity: "-vvvvv",
		viaIR: false,
		testDir: "test",
		srcDir: "src",
		outputDir: "out",
		scriptDir: "script",
		workspaceRoot: vscode.Uri.parse(""),
	};

	constructor(private logger: CockPitLogProvider) {
		this.taskProvider = new FoundryTaskProvider(this, logger);
		this.taskProviderDisposable = vscode.tasks.registerTaskProvider("foundry", this.taskProvider);
	}

	public async initialize(): Promise<void> {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			this.logger.logToOutput("No workspace folder is open");
			vscode.window.showInformationMessage("No workspace folder is open.");
			return;
		}

		const workspaceRoot = workspaceFolders[0].uri;
		this.logger.logToOutput(`Searching for Foundry projects in workspace: ${workspaceRoot.fsPath}`);

		if (!(await this.isForgeInstalled())) {
			this.logger.logToOutput("Foundry is not installed or not in PATH");
			this.showForgeNotInstalledError();
			return;
		}

		try {
			const foundryProjects = await this.findFoundryProjects(workspaceRoot);

			if (foundryProjects.length === 0) {
				throw new Error("No foundry.toml files found in workspace");
			}

			// We only care for the first found project
			this.workspaceRoot = foundryProjects[0];

			if (foundryProjects.length > 1) {
				this.logger.logToOutput(
					`Multiple Foundry projects found. Using: ${this.workspaceRoot.fsPath}`
				);
				this.logger.logToOutput(
					`Other projects found at: ${foundryProjects
						.slice(1)
						.map(p => p.fsPath)
						.join(", ")}`
				);
			}

			await this.checkNodeModules();
			await this.loadFoundryConfig();
			this.isFoundryProject = true;
			this.logger.logToOutput(
				`Successfully loaded Foundry configuration from: ${this.workspaceRoot.fsPath}`
			);
			this.logger.updateStatusBar("$(sync~spin) Forge cockpit detecting contracts...");
			await Promise.all([this.cleanOutputDirectory(), this.executeBuild(false)]);
			this.setupWatchers();
			this.logger.logToOutput("File watchers setup completed");
		} catch (error) {
			const errorMessage = `No Foundry project found in workspace. ${(error as Error).message}`;
			this.logger.updateStatusBar(
				`$(error) Forge cockpit ${errorMessage}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
			this.isFoundryProject = false;
		}
	}

	private async findFoundryProjects(workspaceUri: vscode.Uri): Promise<vscode.Uri[]> {
		const foundryProjects: vscode.Uri[] = [];

		try {
			const foundryFiles = await vscode.workspace.findFiles(
				new vscode.RelativePattern(workspaceUri, "**/foundry.toml"),
				"**/node_modules/**"
			);

			for (const file of foundryFiles) {
				const projectDir = vscode.Uri.file(path.dirname(file.fsPath));
				foundryProjects.push(projectDir);
			}

			foundryProjects.sort((a, b) => {
				const aDepth = path.relative(workspaceUri.fsPath, a.fsPath).split(path.sep).length;
				const bDepth = path.relative(workspaceUri.fsPath, b.fsPath).split(path.sep).length;
				return aDepth - bDepth;
			});
		} catch (error) {
			this.logger.logToOutput(`Error searching for Foundry projects: ${(error as Error).message}`);
		}

		return foundryProjects;
	}

	private async checkNodeModules(): Promise<void> {
		try {
			const packageJsonPath = vscode.Uri.joinPath(this.workspaceRoot, "package.json");
			const nodeModulesPath = vscode.Uri.joinPath(this.workspaceRoot, "node_modules");

			const packageJsonExists = await fileExists(packageJsonPath);
			if (!packageJsonExists) {
				return;
			}

			const nodeModulesExists = await fileExists(nodeModulesPath);
			if (!nodeModulesExists) {
				const message =
					"package.json found but node_modules is missing. Please run 'npm install' or 'yarn install' to install dependencies. Incase your smartcontracts use node_modules for remappings";
				this.logger.logToOutput(message);
				vscode.window.showInformationMessage(message);
			}
		} catch (error) {
			this.logger.logToOutput(`Error checking node_modules: ${(error as Error).message}`);
		}
	}

	private async loadFoundryConfig(): Promise<void> {
		if (!this.workspaceRoot) {
			return;
		}

		const foundryTomlUri = vscode.Uri.joinPath(this.workspaceRoot, "foundry.toml");
		const foundryTomlContent = await vscode.workspace.fs.readFile(foundryTomlUri);
		const parsedContent = new TextDecoder().decode(foundryTomlContent);
		const foundryConfig = toml.parse(parsedContent);

		this.config = {
			verbosity: "-vvvvv",
			viaIR: foundryConfig.profile?.default?.via_ir || false,
			testDir: foundryConfig.profile?.default?.test || "test",
			srcDir: foundryConfig.profile?.default?.src || "src",
			outputDir: foundryConfig.profile?.default?.out || "out",
			scriptDir: foundryConfig.profile?.default?.script || "script",
			workspaceRoot: this.workspaceRoot,
		} as Config;
	}

	private showForgeNotInstalledError(): void {
		this.logger.logToOutput("Showing Foundry installation error dialog");
		vscode.window
			.showErrorMessage(
				"Foundry is not installed or not in PATH. Please install Foundry and ensure it's in your PATH.",
				"Install Foundry",
				"Learn More"
			)
			.then(selection => {
				if (selection === "Install Foundry") {
					this.logger.logToOutput("User clicked 'Install Foundry' - opening installation guide");
					vscode.env.openExternal(
						vscode.Uri.parse("https://book.getfoundry.sh/getting-started/installation")
					);
				} else if (selection === "Learn More") {
					this.logger.logToOutput("User clicked 'Learn More' - opening Foundry documentation");
					vscode.env.openExternal(vscode.Uri.parse("https://book.getfoundry.sh/"));
				}
			});
	}

	private setupWatchers(): void {
		if (!this.workspaceRoot) {
			this.logger.logToOutput("Cannot setup watchers - no workspace root");
			return;
		}

		this.logger.logToOutput(
			`Setting up file watchers for ${this.config?.srcDir} and ${this.config?.outputDir}`
		);

		this.createFileWatcher(`${this.config?.srcDir}/**/*.sol`, this.handleSourceChange.bind(this));
		this.createFileWatcher(`${this.config?.testDir}/**/*.sol`, this.handleSourceChange.bind(this));
		this.createFileWatcher(
			`${this.config?.scriptDir}/**/*.sol`,
			this.handleSourceChange.bind(this)
		);
		this.createFileWatcher(this.config?.outputDir || "out", this.handleFileChange.bind(this));
	}

	private createFileWatcher(pattern: string, changeHandler: (uri: vscode.Uri) => void): void {
		if (!this.workspaceRoot) {
			return;
		}

		const filePattern = new vscode.RelativePattern(this.workspaceRoot, pattern);
		const watcher = vscode.workspace.createFileSystemWatcher(filePattern, false, false, false);

		watcher.onDidCreate(changeHandler);
		watcher.onDidChange(changeHandler);
		watcher.onDidDelete(changeHandler);

		this.fileWatchers.push(watcher);
	}

	private handleSourceChange(uri: vscode.Uri): void {
		this.logger.logToOutput(`Source file changed: ${path.basename(uri.fsPath)}`);
		this.debouncedBuild(1500);
	}

	private handleFileChange(uri: vscode.Uri): void {
		this.logger.logToOutput(`Output file changed: ${path.basename(uri.fsPath)}`);
		this.debouncedBuild(1000);
	}

	private debouncedBuild(delay: number): void {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = setTimeout(async () => {
			await this.triggerBuild();
			vscode.commands.executeCommand(ForgeCockpitCommand.RefreshTestsCommand);
			vscode.commands.executeCommand(ForgeCockpitCommand.LoadCockPitWalletsCommand);
		}, delay);
	}

	public async triggerBuild(): Promise<void> {
		if (!this.isFoundryProject || !this.workspaceRoot) {
			this.logger.logToOutput("Cannot trigger build - not a Foundry project or no workspace");
			return;
		}

		if (this.buildInProgress) {
			this.logger.logToOutput("Build already in progress - queuing next build");
			this.buildQueue = true;
			return;
		}

		this.buildInProgress = true;
		this.logger.logToOutput("Triggering build process");
		this.logger.updateStatusBar(
			"$(sync~spin) Forge cockpit Building...",
			new vscode.ThemeColor("statusBarItem.warningBackground")
		);

		try {
			await this.executeBuild(false);
		} catch (error) {
			this.logger.logToOutput(`Build trigger failed: ${(error as Error).stack}`);
			this.logger.updateStatusBar(
				`$(error) Forge cockpit build failed: ${(error as Error).message}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
		} finally {
			this.buildInProgress = false;
			if (this.buildQueue) {
				this.logger.logToOutput("Processing queued build");
				this.buildQueue = false;
				setTimeout(() => this.triggerBuild(), 100);
			}
		}
	}

	private async getExecutablePath(name: string): Promise<string> {
		const homeDir = process.env.HOME || process.env.USERPROFILE;
		const likelyPath =
			process.platform === "win32"
				? `${homeDir}\\.foundry\\bin\\${name}.exe`
				: `${homeDir}/.foundry/bin/${name}`;

		return new Promise<string>(resolve => {
			fs.access(likelyPath, fs.constants.X_OK, (error: any) => {
				resolve(error ? name : likelyPath);
			});
		});
	}

	private async executeCommand(
		args: string[] = [],
		cwd: string = this.workspaceRoot?.fsPath || "",
		streamOutput: boolean = true
	): Promise<{ stdout: string; stderr: string; exitCode: number }> {
		const env = { ...process.env };
		const homeDir = process.env.HOME || process.env.USERPROFILE;
		const foundryBinDir = path.dirname(
			process.platform === "win32"
				? `${homeDir}\\.foundry\\bin\\${args[0]}.exe`
				: `${homeDir}/.foundry/bin/${args[0]}`
		);

		env.PATH = `${foundryBinDir}${process.platform === "win32" ? ";" : ":"}${env.PATH || ""}`;

		return new Promise((resolve, reject) => {
			if (!streamOutput) {
				cp.exec(args.join(" "), { cwd, env }, (error, stdout, stderr) => {
					if (error) {
						reject({ error, stderr, exitCode: error.code || 1 });
					} else {
						resolve({ stdout, stderr, exitCode: 0 });
					}
				});
				return;
			}

			const [command, ...commandArgs] = args;
			const child = cp.spawn(command, commandArgs, { cwd, env, shell: true });

			let stdout = "";
			let stderr = "";

			child.stdout?.on("data", data => {
				const output = data.toString();
				stdout += output;
				if (streamOutput) {
					this.logger.logToOutput(output.trim());
				}
			});

			child.stderr?.on("data", data => {
				const output = data.toString();
				stderr += output;
				if (streamOutput) {
					this.logger.logToOutput(output.trim());
				}
			});

			child.on("error", error => {
				this.logger.logToOutput(`Process error: ${error.stack}`);
				reject({ error, stderr, exitCode: 1 });
			});

			child.on("close", code => {
				resolve({ stdout, stderr, exitCode: code || 0 });
			});
		});
	}

	private async executeBuild(useViaIr: boolean): Promise<boolean> {
		try {
			this.logger.logToOutput(`Starting build${useViaIr ? " with --via-ir" : ""}`);

			const forgePath = await this.getExecutablePath("forge");
			const args = [forgePath, "build", "--contracts", `./${this.config?.srcDir}`];

			if (useViaIr) {
				args.push("--via-ir");
			}

			const result = await this.executeCommand(args, this.workspaceRoot?.fsPath || "", true);

			if (result.exitCode !== 0) {
				if (!useViaIr && result.stderr.includes("--via-ir")) {
					this.logger.logToOutput("Retrying build with --via-ir flag");
					return this.executeBuild(true);
				}
				this.logger.updateStatusBar(
					`$(error) Forge cockpit build failed`,
					new vscode.ThemeColor("statusBarItem.errorBackground")
				);
				return false;
			}

			this.logger.logToOutput("Build completed successfully");
			this.logger.updateStatusBar("$(check) Forge cockpit build succeeded");
			this.onBuildSucceeded();
			return true;
		} catch (error: any) {
			this.logger.logToOutput(`Build error: ${(error as Error).stack}`);
			this.logger.updateStatusBar(
				`$(error) Forge cockpit build failed: ${(error as Error).message}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
			return false;
		}
	}

	public async runTest(
		contractFile: string,
		testName: string,
		config: Config
	): Promise<TestExecutionResponse> {
		if (!this.isFoundryProject || !this.workspaceRoot) {
			this.logger.logToOutput("Cannot run test - not a Foundry project or no workspace");
			return {
				testName: testName,
				success: false,
			} as TestExecutionResponse;
		}

		this.config = config;
		this.logger.logToOutput(`Starting test execution: ${testName} in ${contractFile}`);
		this.logger.updateStatusBar(
			`$(beaker~spin) Forge cockpit running test: ${testName}`,
			new vscode.ThemeColor("statusBarItem.warningBackground")
		);

		try {
			const definition: CustomTaskDefinition = {
				type: "foundry",
				command: "test",
				testName: `"\\\\b${testName}\\\\b"`,
				contractFile: contractFile,
				taskId: `test-${testName}-${Date.now()}`,
				port: "0",
			};

			const execution = await this.taskProvider.executeTask(definition);
			this.logger.logToOutput(`Test task created for: ${testName}`);

			return new Promise<TestExecutionResponse>(resolve => {
				const disposable = vscode.tasks.onDidEndTaskProcess(e => {
					if (e.execution === execution) {
						if (e.exitCode === 0) {
							this.logger.logToOutput(`Test passed: ${testName}`);
							this.logger.updateStatusBar(
								`$(check) Forge cockpit test passed: ${testName}`,
								new vscode.ThemeColor("statusBarItem.successBackground")
							);
							resolve({
								testName: testName,
								success: true,
							} as TestExecutionResponse);
						} else {
							this.logger.logToOutput(`Test failed: ${testName} with exit code ${e.exitCode}`);
							this.logger.updateStatusBar(
								`$(error) Forge cockpit test failed: ${testName}`,
								new vscode.ThemeColor("statusBarItem.errorBackground")
							);
							resolve({
								testName: testName,
								success: false,
								error: `Test failed with exit code ${e.exitCode}`,
							} as TestExecutionResponse);
						}

						setTimeout(() => {
							this.logger.updateStatusBar("$(check) Forge cockpit ready");
						}, 3000);

						disposable.dispose();
					}
				});
			});
		} catch (error) {
			this.logger.logToOutput(`Failed to run test ${testName}: ${(error as Error).stack}`);
			this.logger.updateStatusBar(
				`$(error) Forge cockpit failed to run test: ${testName}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
			return {
				testName: testName,
				success: false,
				error: `Failed to run test: ${(error as Error).message}`,
			} as TestExecutionResponse;
		}
	}
	public async runAllTests(config: Config): Promise<TestExecutionResponse[]> {
		if (!this.isFoundryProject || !this.workspaceRoot) {
			this.logger.logToOutput("Cannot run tests - not a Foundry project or no workspace");
			return [];
		}

		this.config = config;
		this.logger.logToOutput(`Starting all tests execution`);
		this.logger.updateStatusBar(
			`$(beaker~spin) Forge cockpit running all tests`,
			new vscode.ThemeColor("statusBarItem.warningBackground")
		);

		try {
			const args = ["test", "--json"];

			if (config.viaIR) {
				args.push("--via-ir");
			}

			if (config.verbosity) {
				args.push(config.verbosity);
			}

			const workingDirectory =
				typeof this.workspaceRoot === "string"
					? this.workspaceRoot
					: this.workspaceRoot?.fsPath || process.cwd();

			return new Promise<TestExecutionResponse[]>(resolve => {
				const { spawn } = require("child_process");
				const forgeProcess = spawn("forge", args, {
					cwd: workingDirectory,
					shell: true,
				});

				let output = "";
				let errorOutput = "";

				forgeProcess.stdout?.on("data", (data: Buffer) => {
					output += data.toString();
				});

				forgeProcess.stderr?.on("data", (data: Buffer) => {
					errorOutput += data.toString();
				});

				forgeProcess.on("close", (code: number) => {
					const results = this.parseTestResults(output);
					this.logger.logToOutput(
						`All tests completed successfully \n\n with results: ${JSON.stringify(results)}\n\n`
					);
					if (code === 0) {
						this.logger.logToOutput(`All tests completed successfully`);
						this.logger.updateStatusBar(
							`$(check) Forge cockpit all tests passed`,
							new vscode.ThemeColor("statusBarItem.successBackground")
						);
					} else {
						this.logger.logToOutput(`Some tests failed with exit code ${code}`);
						if (errorOutput) {
							this.logger.logToOutput(`Error output: ${errorOutput}`);
						}
						this.logger.updateStatusBar(
							`$(error) Forge cockpit some tests failed`,
							new vscode.ThemeColor("statusBarItem.errorBackground")
						);
					}

					setTimeout(() => {
						this.logger.updateStatusBar("$(check) Forge cockpit ready");
					}, 3000);

					resolve(results);
				});

				forgeProcess.on("error", (error: Error) => {
					this.logger.logToOutput(`Failed to start forge process: ${error.message}`);
					this.logger.updateStatusBar(
						`$(error) Forge cockpit failed to run tests`,
						new vscode.ThemeColor("statusBarItem.errorBackground")
					);
					resolve([]);
				});
			});
		} catch (error) {
			this.logger.logToOutput(`Failed to run all tests: ${(error as Error).stack}`);
			this.logger.updateStatusBar(
				`$(error) Forge cockpit failed to run tests`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
			return [];
		}
	}

	private parseTestResults(output: string): TestExecutionResponse[] {
		const results: TestExecutionResponse[] = [];

		try {
			const json = JSON.parse(output);
			if (!json || typeof json !== "object") {
				return results;
			}

			Object.keys(json).forEach(contractKey => {
				if (!contractKey.includes(".sol:")) {
					return;
				}

				const contractData = json[contractKey];
				if (!contractData?.test_results) {
					return;
				}

				const testResults = contractData.test_results;
				const fileName = contractKey.split(":")[0]?.split("/").pop() || contractKey;

				Object.keys(testResults).forEach(testKey => {
					const testResult = testResults[testKey];
					if (!testResult?.status) {
						return;
					}

					const isSuccess = testResult.status === "Success";
					const error = !isSuccess ? testResult.reason || "Unknown error" : undefined;

					if (testKey.startsWith("Found ") && testKey.includes("instances:")) {
						const testNamesMatch = testKey.match(/instances: (.+)$/);
						const testNames = testNamesMatch?.[1]?.split(", ") || [];

						testNames.forEach(testName => {
							const trimmedTestName = testName.trim().replace(/\(.*\)$/, "");
							if (!trimmedTestName) {
								return;
							}

							const testResultsMap = new Map<string, boolean>();
							testResultsMap.set(trimmedTestName, isSuccess);

							results.push({
								testName: trimmedTestName,
								fileName,
								success: isSuccess,
								error,
								testResults: testResultsMap,
							});
						});
					} else {
						const testResultsMap = new Map<string, boolean>();
						testResultsMap.set(testKey, isSuccess);

						results.push({
							testName: testKey.replace(/\(.*\)$/, ""),
							fileName,
							success: isSuccess,
							error,
							testResults: testResultsMap,
						});
					}
				});
			});
		} catch (parseError) {
			this.logger.logToOutput(`Failed to parse test results: ${parseError}`);
		}

		return results;
	}
	public async runScript(contractInfo: DeployContract): Promise<ScriptResponse> {
		if (!this.isFoundryProject || !this.workspaceRoot) {
			this.logger.logToOutput("Cannot run script - not a Foundry project or no workspace");
			return {
				success: false,
				contracts: [
					{
						contractName: contractInfo.contractName,
						address: "",
						success: false,
						hash: "",
						nodeUrl: contractInfo.nodeUrl,
						logs: undefined,
					} as DeployedContract,
				],
				scriptName: contractInfo.contractName,
			} as ScriptResponse;
		}

		this.logger.logToOutput(
			`Starting script execution: ${contractInfo.contractName} in ${contractInfo.scriptName}`
		);
		this.logger.updateStatusBar(
			`$(play~spin) Forge cockpit running script: ${contractInfo.contractName}`,
			new vscode.ThemeColor("statusBarItem.warningBackground")
		);

		try {
			const account = this.accounts.find(
				account =>
					checksumAddress(account.publicKey as `0x${string}`) ===
					checksumAddress(contractInfo.msgSender as `0x${string}`)
			);
			if (!account) {
				return {
					success: false,
					contracts: [
						{
							contractName: contractInfo.contractName,
							address: "",
							success: false,
							hash: "",
							nodeUrl: contractInfo.nodeUrl,
							logs: undefined,
						} as DeployedContract,
					],
					scriptName: contractInfo.contractName,
				} as ScriptResponse;
			}
			const forgePath = await this.getExecutablePath("forge");
			const scriptArgs = this.buildScriptArgs({
				...contractInfo,
				privateKey: account.privateKey,
			});
			if (scriptArgs.length === 0) {
				return {
					success: false,
					contracts: [
						{
							contractName: contractInfo.contractName,
							address: "",
							success: false,
							hash: "",
							nodeUrl: contractInfo.nodeUrl,
							logs: undefined,
						} as DeployedContract,
					],
					scriptName: contractInfo.contractName,
				} as ScriptResponse;
			}
			const args = [forgePath, ...scriptArgs];

			this.logger.logToOutput(`Executing command: ${args.join(" ")}`);

			const result = await this.executeCommand(args, this.workspaceRoot?.fsPath || "", true);

			if (result.exitCode !== 0) {
				this.logger.logToOutput(
					`Script failed: ${contractInfo.contractName} with exit code ${result.exitCode}`
				);
				this.logger.logToOutput(`Error output: ${result.stderr}`);

				this.logger.updateStatusBar(
					`$(error) Forge cockpit script failed: ${contractInfo.contractName}`,
					new vscode.ThemeColor("statusBarItem.errorBackground")
				);

				setTimeout(() => {
					this.logger.updateStatusBar("$(check) Forge cockpit ready");
				}, 3000);

				return {
					success: false,
					contracts: [
						{
							contractName: contractInfo.contractName,
							address: "",
							success: false,
							hash: "",
							nodeUrl: contractInfo.nodeUrl,
							logs: undefined,
						} as DeployedContract,
					],
					scriptName: contractInfo.contractName,
				} as ScriptResponse;
			}

			const deployedContracts = await this.extractDeployedContracts(contractInfo);

			if (deployedContracts.length === 0) {
				this.logger.logToOutput(
					`Script completed successfully but no contract deployments detected: ${contractInfo.contractName}`
				);
				deployedContracts.push({
					contractName: contractInfo.contractName,
					address: "",
					success: true,
					hash: "",
					nodeUrl: contractInfo.nodeUrl,
					logs: undefined,
				} as DeployedContract);
			}

			this.logger.logToOutput(`Script completed successfully: ${contractInfo.contractName}`);
			this.logger.logToOutput(`Deployment results: ${JSON.stringify(deployedContracts, null, 2)}`);

			this.logger.updateStatusBar(
				`$(check) Forge cockpit script completed: ${contractInfo.contractName}`,
				new vscode.ThemeColor("statusBarItem.successBackground")
			);

			setTimeout(() => {
				this.logger.updateStatusBar("$(check) Forge cockpit ready");
			}, 3000);

			return {
				success: true,
				contracts: deployedContracts,
				scriptName: contractInfo.contractName,
			} as ScriptResponse;
		} catch (error: any) {
			this.logger.logToOutput(`Script execution error: ${(error as Error).message}`);

			this.logger.updateStatusBar(
				`$(error) Forge cockpit script failed: ${contractInfo.contractName}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);

			setTimeout(() => {
				this.logger.updateStatusBar("$(check) Forge cockpit ready");
			}, 3000);

			return {
				success: false,
				contracts: [
					{
						contractName: contractInfo.contractName,
						address: "",
						success: false,
						hash: "",
						nodeUrl: contractInfo.nodeUrl,
						logs: undefined,
					} as DeployedContract,
				],
				scriptName: contractInfo.contractName,
			} as ScriptResponse;
		}
	}

	public async extractDeployedContracts(contractInfo: DeployContract): Promise<DeployedContract[]> {
		if (!this.workspaceRoot) {
			return [];
		}

		const deployedContracts: DeployedContract[] = [];

		try {
			const broadcastDir = vscode.Uri.joinPath(
				this.workspaceRoot,
				"broadcast",
				`${contractInfo.scriptName}`
			);
			const runLatestFiles = await vscode.workspace.findFiles(
				new vscode.RelativePattern(broadcastDir, `**/${contractInfo.chainId}/run-latest.json`)
			);

			for (const fileUri of runLatestFiles) {
				const fileData = await vscode.workspace.fs.readFile(fileUri);
				const content = JSON.parse(new TextDecoder().decode(fileData));

				if (content.transactions && Array.isArray(content.transactions)) {
					for (const tx of content.transactions) {
						if (tx.transactionType === "CREATE" && tx.contractAddress) {
							deployedContracts.push({
								contractName: tx.contractName || "Unknown",
								address: tx.contractAddress,
								success: true,
								hash: tx.hash || "",
								nodeUrl: contractInfo.nodeUrl || "",
								logs: undefined,
							});
						}
					}
				}
			}

			this.logger.logToOutput(
				`Extracted ${deployedContracts.length} deployed contracts from broadcast files`
			);
		} catch (error) {
			this.logger.logToOutput(`Failed to read deployment files: ${(error as Error).stack}`);
		}

		return deployedContracts;
	}
	private buildScriptArgs(contractInfo: DeployContract): string[] {
		const args = ["script", `${this.config.scriptDir}/${contractInfo.scriptName}`];

		if (contractInfo.scriptName) {
			args.push(contractInfo.scriptName);
		}

		if (contractInfo.privateKey) {
			args.push("--private-key", contractInfo.privateKey);
		}

		if (contractInfo.viaIR) {
			args.push("--via-ir");
		}

		args.push("--rpc-url", contractInfo.nodeUrl);
		args.push("--broadcast");
		args.push("-vvvvv");

		return args;
	}
	public async cleanOutputDirectory(): Promise<void> {
		if (!this.isFoundryProject || !this.workspaceRoot) {
			this.logger.logToOutput(
				"Cannot clean output directory - not a Foundry project or no workspace"
			);
			return;
		}

		this.logger.updateStatusBar(
			`$(sync~spin) Forge cockpit cleaning ${this.config.outputDir}...`,
			new vscode.ThemeColor("statusBarItem.warningBackground")
		);

		try {
			this.logger.logToOutput(`Starting clean of ${this.config.outputDir}`);

			const forgePath = await this.getExecutablePath("forge");
			const args = [forgePath, "clean"];

			const result = await this.executeCommand(args, this.workspaceRoot?.fsPath || "", true);

			if (result.exitCode !== 0) {
				this.logger.logToOutput(`Clean failed with exit code: ${result.exitCode}`);
			} else {
				this.logger.logToOutput("Clean completed successfully");
			}

			this.logger.updateStatusBar("$(check) Forge cockpit clean completed");
			setTimeout(() => {
				this.logger.updateStatusBar("$(check) Forge cockpit ready");
			}, 1500);
		} catch (error: any) {
			this.logger.logToOutput(`Clean error: ${(error as Error).stack}`);
			this.logger.updateStatusBar(
				`$(error) Forge cockpit clean failed: ${(error as Error).message}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
		}
	}

	private async onBuildSucceeded(): Promise<void> {
		this.logger.logToOutput("Build succeeded - scanning for contract ABIs");
		await this.getAllContractABIs();
		this.logger.logToOutput("Firing build success event");
		this._onDidBuildSucceed.fire();
	}
	public async loadWallets(): Promise<string[]> {
		let accounts = [] as string[];
		try {
			if (!this.workspaceRoot) {
				return [];
			}
			const cockpitAccounts = vscode.Uri.joinPath(this.workspaceRoot, "cockpit-accounts.json");
			const exists = await fileExists(cockpitAccounts);

			if (!exists) {
				this.logger.logToOutput("No cockpit-accounts.json file found, using default accounts");
				const content = new TextEncoder().encode(JSON.stringify(DEFAULT_ANVIL_ACCOUNTS, null, 2));
				try {
					await vscode.workspace.fs.writeFile(cockpitAccounts, content);
				} catch (error) {
					this.logger.logToOutput(`Error writing default accounts: ${(error as Error).message}`);
				}
			}
			const rawAccounts = await vscode.workspace.fs.readFile(cockpitAccounts);
			const parsedAccounts = JSON.parse(new TextDecoder().decode(rawAccounts)) as ImportedAccounts;
			const readAcc = readAccounts(
				parsedAccounts ? parsedAccounts.accounts : DEFAULT_ANVIL_ACCOUNTS.accounts
			);
			this.accounts = readAcc;
			this.logger.logToOutput(`Loaded cockpit wallets with info: ${JSON.stringify(readAcc)}`);
			accounts = readAcc.map(account => account.publicKey);
		} catch (error) {
			this.logger.updateStatusBar(`$(error) Forge cockpit ${(error as Error).message}`);
			this.logger.logToOutput(`Error loading default wallets: ${(error as Error).stack}`);
		}
		return accounts;
	}
	public async getAllContractABIs(): Promise<TestFile[]> {
		if (!this.workspaceRoot || !this.isFoundryProject) {
			const errorMessage = "cannot scan for contracts: Not a valid Foundry project";
			this.logger.logToOutput(`Error: ${errorMessage}`);
			this.logger.updateStatusBar(
				`$(error) Forge cockpit ${errorMessage}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
			return [];
		}

		this.logger.logToOutput(`Scanning for contract ABIs in ${this.config?.outputDir}`);
		const outputDirUri = vscode.Uri.joinPath(this.workspaceRoot, this.config?.outputDir);
		const contracts: TestFile[] = [];

		try {
			const jsonPattern = new vscode.RelativePattern(outputDirUri, "**/*.json");
			const jsonFiles = await vscode.workspace.findFiles(jsonPattern);

			this.logger.logToOutput(`Found ${jsonFiles.length} JSON files in output directory`);

			if (jsonFiles.length === 0) {
				const message = `No contract files found in ${this.config.testDir} directory. Have you compiled the project?`;
				this.logger.logToOutput(message);
				this.triggerBuild();
				vscode.window.showInformationMessage(message);
				return [];
			}

			let contractCount = 0;
			for (const fileUri of jsonFiles) {
				const contractName = path.basename(fileUri.fsPath, ".json");

				try {
					const fileData = await vscode.workspace.fs.readFile(fileUri);
					const content = JSON.parse(new TextDecoder().decode(fileData));
					const abi = content.abi as ABI;
					const bytecode =
						content.bytecode && content.bytecode.object ? (content.bytecode.object as string) : "";
					const solFileName = this.getScriptName(fileUri.fsPath);

					if (abi) {
						contracts.push({
							fileName: contractName,
							filePath: fileUri.fsPath,
							solFileName: solFileName,
							tests: [],
							abi,
							bytecode,
							isFolder: false,
						} as TestFile);
						contractCount++;
					}
				} catch (error) {
					this.logger.logToOutput(
						`Failed to parse contract file ${contractName}: ${(error as Error).stack}`
					);
					continue;
				}
			}

			this.logger.logToOutput(`Successfully loaded ${contractCount} contracts`);
			return contracts;
		} catch (error) {
			const errorMessage = `error scanning output directory: ${(error as Error).message}`;
			this.logger.logToOutput(`Error: ${(error as Error).stack}`);
			this.logger.updateStatusBar(`$(error) Forge cockpit ${errorMessage}`);
			return [];
		}
	}

	private getScriptName(filePath: string) {
		if (filePath) {
			const parentDir = path.dirname(filePath);
			const solFileName = path.basename(parentDir);
			return solFileName;
		}
		return "";
	}

	private async isForgeInstalled(): Promise<boolean> {
		return new Promise<boolean>(resolve => {
			let command =
				process.platform === "win32"
					? "where forge 2>nul"
					: "which forge 2>/dev/null || command -v forge 2>/dev/null";

			cp.exec(command, (error, stdout) => {
				if (!error && stdout) {
					resolve(true);
					return;
				}

				const homeDir = process.env.HOME || process.env.USERPROFILE;
				const foundryPath =
					process.platform === "win32"
						? `${homeDir}\\.foundry\\bin\\forge.exe`
						: `${homeDir}/.foundry/bin/forge`;
				fs.access(foundryPath, fs.constants.X_OK, (error: any) => {
					resolve(!error);
				});
			});
		});
	}

	public async getActiveNodes(): Promise<string[]> {
		this.logger.logToOutput("Checking for active fork nodes");

		const activePorts: string[] = [];
		const runningTasks = this.taskProvider.getRunningTasks();

		for (const [taskId, execution] of runningTasks) {
			const task = execution.task;
			const definition = task.definition as CustomTaskDefinition;

			if (definition.command === "fork" && definition.port) {
				if (await this.isPortInUse(definition.port)) {
					activePorts.push(definition.port);
				} else {
					this.logger.logToOutput(
						`Removing stale fork task ${taskId} - port ${definition.port} not in use`
					);
					this.taskProvider.terminateTask(taskId);
				}
			}
		}

		this.logger.logToOutput(
			`Found ${activePorts.length} active fork nodes on ports: ${activePorts.join(", ")}`
		);
		return activePorts.sort((a, b) => parseInt(a) - parseInt(b));
	}

	public async forkNode(forkInfo: ForkInfo): Promise<ForkDetails> {
		this.logger.logToOutput(
			`Attempting to fork node on port ${forkInfo.port} with URL: ${forkInfo.nodeUrl || "local"}`
		);

		const inUse = await this.isPortInUse(forkInfo.port);
		if (!this.isFoundryProject || !this.workspaceRoot || inUse) {
			const reason = !this.isFoundryProject
				? "not a Foundry project"
				: !this.workspaceRoot
					? "no workspace"
					: "port already in use";
			this.logger.logToOutput(`Fork failed: ${reason}`);
			return {
				success: false,
				accounts: [],
				port: forkInfo.port.toString(),
			};
		}

		try {
			const definition: CustomTaskDefinition = {
				type: "foundry",
				command: "fork",
				taskId: forkInfo.tabId,
				port: forkInfo.port.toString(),
				nodeUrl: forkInfo.nodeUrl,
			};

			await this.taskProvider.executeTask(definition);
			this.logger.logToOutput(
				`Fork task started, waiting for node to be ready on port ${forkInfo.port}`
			);

			const success = await this.waitForNodeReady(forkInfo.port);

			if (success) {
				this.logger.logToOutput(`Fork node successfully started on port ${forkInfo.port}`);
			} else {
				this.logger.logToOutput(`Fork node failed to start on port ${forkInfo.port} - timeout`);
			}

			return {
				success,
				accounts: [],
				port: forkInfo.port,
			};
		} catch (error) {
			this.logger.logToOutput(`Error creating anvil instance: ${(error as Error).stack}`);
			this.logger.updateStatusBar(
				`$(error) Forge cockpit error creating anvil instance: ${(error as Error).message}`,
				new vscode.ThemeColor("statusBarItem.errorBackground")
			);
			return {
				success: false,
				accounts: [],
				port: forkInfo.port,
			};
		}
	}

	public async stopForkNode(port: string): Promise<boolean> {
		try {
			this.logger.logToOutput(`Stopping anvil node on port: ${port}`);
			const stopped = await this.taskProvider.terminateTask(port);
			this.logger.updateStatusBar(
				`$(check) Forge cockpit anvil node stopped on port: ${port}`,
				new vscode.ThemeColor("statusBarItem.successBackground")
			);
			setTimeout(() => {
				this.logger.updateStatusBar("$(check) Forge cockpit ready");
			}, 2000);
			return stopped;
		} catch (error) {
			this.logger.logToOutput(`error stopping fork ${(error as Error).stack}`);
		}
		return false;
	}

	private async waitForNodeReady(port: string, maxAttempts = 100): Promise<boolean> {
		this.logger.logToOutput(
			`Waiting for node to be ready on port ${port} (max ${maxAttempts} attempts)`
		);

		return new Promise<boolean>(resolve => {
			let attempts = 0;
			const check = async () => {
				attempts++;
				this.logger.logToOutput(
					`Waiting for node to be ready on port ${port} (current attempts ${attempts})`
				);

				if (await this.isPortInUse(port)) {
					this.logger.logToOutput(`Node ready on port ${port} after ${attempts} attempts`);
					resolve(true);
					return;
				}

				if (attempts >= maxAttempts) {
					this.logger.logToOutput(
						`Node failed to start on port ${port} - timeout after ${attempts} attempts`
					);
					resolve(false);
					return;
				}

				setTimeout(check, 1000);
			};
			check();
		});
	}

	private async isPortInUse(port: string): Promise<boolean> {
		return new Promise<boolean>(resolve => {
			const socket = new net.Socket();

			socket.once("connect", () => {
				socket.destroy();
				this.logger.logToOutput(`Port ${port} is in use`);
				resolve(true);
			});

			socket.once("error", () => {
				this.logger.logToOutput(`Port ${port} is not in use`);
				resolve(false);
			});

			socket.connect(+port, "127.0.0.1");
		});
	}

	public async disposeForkTasks(): Promise<void> {
		await this.taskProvider.terminateTaskByType("fork");
	}

	public async closeAllTaskTerminals(): Promise<void> {
		await this.taskProvider.closeAllTaskTerminals();
	}

	public getConfig(): Config {
		return this.config;
	}

	public getSourceDirectory(): string {
		return this.config?.srcDir || "src";
	}

	public isFoundry(): boolean {
		return this.isFoundryProject;
	}

	public dispose(): void {
		this.fileWatchers.forEach(watcher => watcher.dispose());

		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}

		this.taskProvider.dispose();
		this.taskProviderDisposable?.dispose();
		this.logger.dispose();
		this._onDidBuildSucceed.dispose();
	}
}
