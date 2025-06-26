import * as vscode from "vscode";
import { FoundryProjectController } from "../controllers/forgeProjectController";
import { SingleTest, TestFile, Config, Test } from "../types";
import { CockPitLogProvider } from "./logProvider";

export class ForgeTestProvider {
	private testController: vscode.TestController;
	private testItems: Map<string, vscode.TestItem> = new Map();
	private testData: Map<string, Test> = new Map();
	private currentRun: vscode.TestRun | undefined;
	private currentCancellationTokenSource: vscode.CancellationTokenSource =
		new vscode.CancellationTokenSource();

	constructor(
		private contracts: TestFile[],
		private onDidChangeContracts: vscode.Event<TestFile[]>,
		private foundryController: FoundryProjectController,
		private logger: CockPitLogProvider
	) {
		this.testController = vscode.tests.createTestController(
			"forgeCockpitTests",
			"Forge cockpit Tests"
		);

		this.onDidChangeContracts((contracts: TestFile[]) => {
			this.contracts = contracts;
			this.refreshTests();
		});

		this.testController.createRunProfile(
			"Run Test",
			vscode.TestRunProfileKind.Run,
			(request, token) => this.runHandler(request, token, false),
			true
		);

		this.testController.createRunProfile(
			"Run Test via IR",
			vscode.TestRunProfileKind.Run,
			(request, token) => this.runHandler(request, token, true)
		);

		this.testController.createRunProfile(
			"Verbose",
			vscode.TestRunProfileKind.Coverage,
			(request, token) => this.runHandler(request, token, false, "-vvvvv"),
			false
		);

		this.refreshTests();
	}

	public resetTestStates(): void {
		this.refreshTests();
	}

	public async stopTests(token: vscode.CancellationToken): Promise<void> {
		if (this.currentCancellationTokenSource) {
			this.currentCancellationTokenSource.cancel();
			this.currentCancellationTokenSource.dispose();
		}

		if (this.currentRun) {
			this.currentRun.end();
			this.currentRun = undefined;
		}

		if (this.testController.refreshHandler) {
			await this.testController.refreshHandler(token);
		}
	}

	public async refreshTests(): Promise<void> {
		this.clearAllTests();
		this.buildTestStructure();
	}

	private clearAllTests(): void {
		this.testController.items.forEach(item => this.disposeTestItem(item));
		this.testController.items.replace([]);
		this.testItems.clear();
		this.testData.clear();
		this.testController.invalidateTestResults();
	}

	private disposeTestItem(item: vscode.TestItem): void {
		item.children?.forEach(child => this.disposeTestItem(child));
	}

	private buildTestStructure(): void {
		const rootItem = this.testController.createTestItem("test", "test", vscode.Uri.file("test"));
		rootItem.canResolveChildren = true;
		this.testItems.set("test", rootItem);
		this.testController.items.add(rootItem);

		this.buildFolderStructure();
		this.contracts.forEach(contract => this.addTestContract(contract));
	}

	private buildFolderStructure(): void {
		const createdFolders = new Set<string>(["test"]);

		for (const contract of this.contracts) {
			if (!contract.filePath) {
				continue;
			}

			const contractPath = contract.filePath.replace(/\\/g, "/");
			const pathParts = contractPath.split("/");
			let currentPath = "test";

			for (let i = 0; i < pathParts.length - 1; i++) {
				const folderName = pathParts[i];
				const newPath = `${currentPath}/${folderName}`;

				if (!createdFolders.has(newPath)) {
					const parentItem = this.testItems.get(currentPath);
					if (parentItem) {
						const folderItem = this.testController.createTestItem(
							newPath,
							folderName,
							vscode.Uri.file(newPath)
						);
						folderItem.canResolveChildren = true;
						parentItem.children.add(folderItem);
						this.testItems.set(newPath, folderItem);
						createdFolders.add(newPath);
					}
				}
				currentPath = newPath;
			}
		}
	}

	private addTestContract(contract: TestFile): void {
		if (!contract.filePath) {
			return;
		}

		const contractPath = contract.filePath.replace(/\\/g, "/");
		const pathParts = contractPath.split("/");
		const parentPath = pathParts.slice(0, pathParts.length - 1).join("/");
		const fullParentPath = parentPath ? `test/${parentPath}` : "test";

		const parentItem = this.testItems.get(fullParentPath);
		if (!parentItem) {
			return;
		}

		const workspaceRoot = this.foundryController.getConfig().workspaceRoot;
		const contractUri = vscode.Uri.joinPath(workspaceRoot, contract.filePath);
		const contractItem = this.testController.createTestItem(
			contractPath,
			contract.fileName,
			contractUri
		);

		contractItem.canResolveChildren = true;
		this.testItems.set(contractPath, contractItem);
		parentItem.children.add(contractItem);

		if (contract.tests?.length > 0) {
			contract.tests.forEach(test =>
				this.addTestMethod(contractItem, contract.filePath, test, contractUri)
			);
		}
	}

	private addTestMethod(
		contractItem: vscode.TestItem,
		contractPath: string,
		test: SingleTest,
		contractUri: vscode.Uri
	): void {
		const testId = `${contractPath}:${test.testName}`;
		const testItem = this.testController.createTestItem(testId, test.testName, contractUri);

		this.testData.set(testId, {
			contractName: contractPath,
			testName: test.testName,
		});
		contractItem.children.add(testItem);
		this.testItems.set(testId, testItem);
	}

	private async runHandler(
		request: vscode.TestRunRequest,
		token: vscode.CancellationToken,
		viaIR: boolean,
		verbose?: string
	): Promise<void> {
		this.stopTests(token);
		this.currentCancellationTokenSource = new vscode.CancellationTokenSource();
		this.currentRun = this.testController.createTestRun(request);
		const run = this.currentRun;

		const testsToRun: vscode.TestItem[] = [];

		if (request.include) {
			request.include.forEach(test => this.collectTestItems(test, testsToRun, request.exclude));
		} else {
			this.testController.items.forEach(item =>
				this.collectTestItems(item, testsToRun, request.exclude)
			);
		}

		const totalTests = testsToRun.length;
		run.appendOutput(`Running ${totalTests} tests`);
		const config: Config = {
			...this.foundryController.getConfig(),
			viaIR,
			verbosity: verbose || "-vvvvv",
		};

		if (totalTests === 0) {
			run.appendOutput(`No tests found to run.`);
			this.logger.logToOutput(`No tests found to run.`);
			run.end();
			this.currentRun = undefined;
			this.currentCancellationTokenSource.dispose();
			return;
		}

		if (
			this.currentCancellationTokenSource.token.isCancellationRequested ||
			token.isCancellationRequested
		) {
			run.appendOutput(`Test execution cancelled.`);
			this.logger.logToOutput(`Test execution cancelled.`);
			run.end();
			this.currentRun = undefined;
			this.currentCancellationTokenSource.dispose();
			return;
		}

		testsToRun.forEach(test => {
			const testInfo = this.testData.get(test.id);
			if (testInfo) {
				run.started(test);
			}
		});

		try {
			if (testsToRun.length === 1) {
				const testInfo = this.testData.get(testsToRun[0].id);
				if (!testInfo) {
					run.failed(testsToRun[0], new vscode.TestMessage("Test info not found"));
					run.appendOutput(`Test failed: ${testsToRun[0].label} - Test info not found`);
					this.logger.logToOutput(`Test failed: ${testsToRun[0].label} - Test info not found`);
				} else {
					const results = await this.foundryController.runTest(
						testInfo.contractName,
						testInfo?.testName,
						config
					);

					if (results.success) {
						run.passed(testsToRun[0]);
						const message = `Test passed: ${testInfo.testName}`;
						run.appendOutput(message);
						this.logger.logToOutput(message);
					} else {
						run.failed(
							testsToRun[0],
							new vscode.TestMessage(`Error running test ${results.error}`)
						);
						const message = `Test failed: ${testInfo.testName} - ${results.error}`;
						run.appendOutput(message);
						this.logger.logToOutput(message);
					}
				}
			} else {
				const results = await this.foundryController.runAllTests(config);

				testsToRun.forEach(test => {
					const testInfo = this.testData.get(test.id);
					if (!testInfo) {
						run.failed(test, new vscode.TestMessage("Test info not found"));
						return;
					}

					const testFileName = test.id.split(":")[0]?.split("/").pop();
					const result = results.find(r => r.fileName === testFileName);

					if (result && result.success) {
						run.passed(test);
						run.appendOutput(`Test passed: ${testInfo.testName}`);
						this.logger.logToOutput(`Test passed: ${testInfo.testName}`);
					} else if (result) {
						run.failed(
							test,
							new vscode.TestMessage(`Test failed: ${result.error || "Test failed"}`)
						);
						run.appendOutput(
							`Test failed: ${testInfo.testName} - ${result.error || "Test failed"}`
						);
						this.logger.logToOutput(
							`Test failed: ${testInfo.testName} - ${result.error || "Test failed"}`
						);
					} else {
						run.failed(test, new vscode.TestMessage(`Test not found in results`));
						run.appendOutput(`Test failed: ${testInfo.testName} - Test not found in results`);
						this.logger.logToOutput(
							`Test failed: ${testInfo.testName} - Test not found in results`
						);
					}
				});
			}
		} catch (error) {
			testsToRun.forEach(test => {
				const testInfo = this.testData.get(test.id);
				if (!testInfo) {
					return;
				}

				const message = new vscode.TestMessage(`Execution error: ${(error as Error).message}`);
				run.failed(test, message);
				run.appendOutput(`Test failed: ${testInfo.testName} - Execution error`);
			});
			run.appendOutput(`Test execution error: ${(error as Error).message}`);
			this.logger.logToOutput(`Test execution error: ${(error as Error).stack}`);
		}

		run.appendOutput(`Test execution complete.`);
		run.end();
		this.currentRun = undefined;
		this.currentCancellationTokenSource.dispose();
	}

	private collectTestItems(
		item: vscode.TestItem,
		collected: vscode.TestItem[],
		excluded?: readonly vscode.TestItem[]
	): void {
		if (excluded?.includes(item)) {
			return;
		}

		if (this.testData.has(item.id)) {
			collected.push(item);
			return;
		}

		item.children?.forEach(child => this.collectTestItems(child, collected, excluded));
	}

	public runTest(test: SingleTest): void {
		const testId = `${test.contractName}:${test.testName}`;
		const testItem = this.testItems.get(testId);

		if (testItem) {
			const request = new vscode.TestRunRequest([testItem]);
			this.runHandler(request, new vscode.CancellationTokenSource().token, false);
		}
	}

	public runTestViaIR(test: SingleTest): void {
		const testId = `${test.contractName}:${test.testName}`;
		const testItem = this.testItems.get(testId);

		if (testItem) {
			const request = new vscode.TestRunRequest([testItem]);
			this.runHandler(request, new vscode.CancellationTokenSource().token, true);
		}
	}

	public runGroup(groupId: string): void {
		const groupItem = this.testItems.get(groupId);

		if (groupItem) {
			const request = new vscode.TestRunRequest([groupItem]);
			this.runHandler(request, new vscode.CancellationTokenSource().token, false);
		}
	}

	public dispose(): void {
		this.stopTests(this.currentCancellationTokenSource.token);
		this.testController.dispose();
	}
}
