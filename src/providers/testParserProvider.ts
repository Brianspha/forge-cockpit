import * as vscode from "vscode";
import * as path from "path";
import { Config, SingleTest, TestFile } from "../types";
import { CockPitLogProvider } from "./logProvider";

export class TestParserProvider {
	private functionRegex: RegExp = /function\s+(test\w*)\s*\(/g;
	private watcher: vscode.FileSystemWatcher | undefined;
	private _onDidChangeContracts: vscode.EventEmitter<TestFile[]> = new vscode.EventEmitter<
		TestFile[]
	>();
	private debounceTimer: NodeJS.Timeout | undefined;
	public readonly onDidChangeContracts: vscode.Event<TestFile[]> = this._onDidChangeContracts.event;
	public contracts: TestFile[] = [];

	constructor(
		private config: Config,
		private logger: CockPitLogProvider
	) {}

	public async initialize(): Promise<void> {
		this.contracts = [];
		if (!this.config.workspaceRoot) {
			this.logger.logToOutput("Workspace root not defined. Please open a Foundry project.");
			vscode.window.showErrorMessage("Workspace root not defined.");
			return;
		}

		const testDirUri = vscode.Uri.joinPath(this.config.workspaceRoot, this.config.testDir);
		const solPattern = new vscode.RelativePattern(testDirUri, "**/*.sol");
		const solFiles = await vscode.workspace.findFiles(solPattern);

		for (const fileUri of solFiles) {
			const fileName = path.basename(fileUri.fsPath);
			if (!this.isTestFile(fileName)) {
				continue;
			}

			try {
				const raw = await vscode.workspace.fs.readFile(fileUri);
				const content = new TextDecoder().decode(raw);
				const contractName = this.extractContractNameFromSource(content, fileName);

				const singleTests = this.extractTestFunctionsFromSource(content).map(test => {
					return {
						...test,
						filePath: fileUri.fsPath,
						contractName,
					};
				});
				if (singleTests.length === 0 || !contractName) {
					continue;
				}

				const relativeToWorkspace = path
					.relative(this.config.workspaceRoot.fsPath, fileUri.fsPath)
					.replace(/\\/g, "/");

				this.contracts.push({
					fileName: fileName,
					filePath: relativeToWorkspace,
					isFolder: false,
					tests: singleTests,
				} as TestFile);
			} catch (error) {
				continue;
			}
		}

		this.setupFileWatcher();
	}

	private extractContractNameFromSource(content: string, fallbackFileName: string): string {
		const contractMatch = content.match(/contract\s+(\w+)(?:\s+is\s+.*?)?\s*\{/);
		if (contractMatch && contractMatch[1]) {
			return contractMatch[1];
		}
		return fallbackFileName.replace(/\.sol$/, "");
	}

	private extractTestFunctionsFromSource(content: string): SingleTest[] {
		return Array.from(content.matchAll(this.functionRegex), match => match[1]).map(testName => {
			return {
				testName: testName,
				contractName: "",
				status: false,
				filePath: "",
			} as SingleTest;
		});
	}

	private setupFileWatcher() {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			return;
		}

		try {
			const pattern = new vscode.RelativePattern(
				workspaceFolders[0],
				`${this.config.testDir}/**/*.t.sol`
			);
			this.watcher = vscode.workspace.createFileSystemWatcher(pattern);

			this.watcher.onDidCreate(() => this.triggerRefresh());
			this.watcher.onDidChange(() => this.triggerRefresh());
			this.watcher.onDidDelete(() => this.triggerRefresh());
		} catch (error) {}
	}

	public getIndividualTests(): SingleTest[] {
		const singleTests: SingleTest[] = [];
		for (const contract of this.contracts) {
			for (const test of contract.tests) {
				singleTests.push({
					contractName: contract.fileName,
					testName: test.testName,
					filePath: contract.filePath,
					viaIR: false,
					status: false,
				} as SingleTest);
			}
		}
		return singleTests;
	}

	private triggerRefresh() {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}
		this.debounceTimer = setTimeout(async () => {
			await this.initialize();
			this._onDidChangeContracts.fire(this.contracts);
		}, 1000);
	}

	public async refresh() {
		await this.initialize();
		this._onDidChangeContracts.fire(this.contracts);
	}

	private isTestFile(fileName: string): boolean {
		return /^[^.\\/]+\.t\.sol$/.test(fileName);
	}

	dispose() {
		if (this.watcher) {
			this.watcher.dispose();
		}
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}
		this._onDidChangeContracts.dispose();
	}
}
