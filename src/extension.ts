import * as vscode from "vscode";
import * as dotenv from "dotenv";
import * as path from "path";
import { TestHoverProvider } from "./providers/hoverProvider";
import { TestCodeLensProvider } from "./providers/codeLensProvider";
import { TestDecorationProvider } from "./providers/testCodeDecoProvider";
import { FoundryProjectController } from "./controllers/forgeProjectController";
import {
	DeployContract,
	DeployedContract,
	ForkInfo,
	FunctionCall,
	LocalProjectState,
	CockpitSettings,
	CockpitSettingUpdate,
	ScriptResponse,
	SingleTest,
	TestFile,
	TransferTransaction,
	WalletBalancesInfo,
} from "./types";
import { TestParserProvider } from "./providers/testParserProvider";
import { ForgeTestProvider } from "./providers/forgeTestProvider";
import { ForgeCockPitPanel } from "./panels/forgeCockPitPanel";
import { CockPitActionsProvider } from "./providers/cockpitActionsProvider";
import { AbiProvider } from "./providers/abiProvider";
import { StubTestProvider } from "./providers/stubTestProvider";
import { WalletProvider } from "./providers/walletProvider";
import { CockPitLogProvider } from "./providers/logProvider";
import { ACTIVE_NODE_KEY, ForgeCockpitCommand, WebviewCommand } from "./utils";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export async function activate(context: vscode.ExtensionContext) {
	const logger = new CockPitLogProvider();
	const foundryProjectController: FoundryProjectController = new FoundryProjectController(logger);
	await foundryProjectController.initialize();

	if (foundryProjectController.isFoundry()) {
		const testParserProvider = new TestParserProvider(foundryProjectController.getConfig(), logger);
		const abiProvider = new AbiProvider(foundryProjectController, logger);
		abiProvider.initialize();
		await Promise.all([
			testParserProvider.initialize(),
			abiProvider.refresh(),
			foundryProjectController.refreshLocalProjectState(),
		]);
		const testingProvider = new ForgeTestProvider(
			testParserProvider.contracts,
			testParserProvider.onDidChangeContracts,
			foundryProjectController,
			logger
		);

		const hoverProvider = new TestHoverProvider(foundryProjectController);
		const codeLensProvider = new TestCodeLensProvider(logger);
		const decorationProvider = new TestDecorationProvider();
		const actionsProvider = new CockPitActionsProvider();
		const actionsTreeView = vscode.window.createTreeView("forgeCockpitActions", {
			treeDataProvider: actionsProvider,
			showCollapseAll: false,
		});

		context.subscriptions.push(
			foundryProjectController.onDidChangeProjectState(projectState => {
				ForgeCockPitPanel.sendProjectStatus(projectState);
			}),
			abiProvider.onDidChangeAbis(() => {
				ForgeCockPitPanel.sendContracts(abiProvider.abis);
			}),
			vscode.workspace.onDidChangeConfiguration(event => {
				if (event.affectsConfiguration("forge-cockpit.testVerbosity")) {
					ForgeCockPitPanel.sendCockpitSettings(foundryProjectController.getCockpitSettings());
				}
			})
		);

		const rebuildAndRefreshProject = async (): Promise<LocalProjectState> => {
			const projectState = await foundryProjectController.triggerBuild();
			await Promise.all([
				testParserProvider.refresh(),
				testingProvider.refreshTests(),
				abiProvider.refresh(),
				foundryProjectController.refreshLocalProjectState(),
			]);
			return projectState;
		};

		const rebuildProjectIfPossible = async (notifyOnFailure: boolean = true): Promise<boolean> => {
			const projectState = await rebuildAndRefreshProject();
			if (projectState.status === "ready") {
				return true;
			}

			if (notifyOnFailure) {
				vscode.window.showErrorMessage(projectState.message);
			}
			return false;
		};

		const compileGeneratedScaffold = async (
			targetUri: vscode.Uri | undefined,
			label: string
		): Promise<void> => {
			if (!targetUri) {
				return;
			}

			const relativePath = vscode.workspace.asRelativePath(targetUri);
			const rebuildSucceeded = await rebuildProjectIfPossible(false);
			if (rebuildSucceeded) {
				vscode.window.showInformationMessage(`Generated ${label}: ${relativePath}`);
				return;
			}

			vscode.window.showWarningMessage(
				`Generated ${label}: ${relativePath}. Fix the build errors and rebuild again.`
			);
		};

		const runTestWithRetry = async (test: SingleTest, viaIR: boolean): Promise<void> => {
			const runSucceeded = viaIR
				? await testingProvider.runTestViaIR(test)
				: await testingProvider.runTest(test);
			if (runSucceeded) {
				return;
			}

			const rebuildSucceeded = await rebuildProjectIfPossible();
			if (!rebuildSucceeded) {
				return;
			}

			if (viaIR) {
				await testingProvider.runTestViaIR(test);
				return;
			}

			await testingProvider.runTest(test);
		};

		context.subscriptions.push(
			vscode.commands.registerCommand(
				ForgeCockpitCommand.StubForgeTestsCommand,
				async (contract: TestFile): Promise<void> => {
					const contractName = contract.fileName.replace(/\.sol$/, "");
					const abi = abiProvider.abis.find(a => a.fileName === contract.fileName)?.abi;

					if (!abi) {
						vscode.window.showErrorMessage(`ABI not found for ${abiProvider.abis.length} ABIs`);
						return;
					}

					const stubTestProvider = new StubTestProvider(
						contractName,
						abi,
						logger,
						foundryProjectController.getConfig()
					);
					const targetUri = await stubTestProvider.generateTestFile(contract.filePath);
					await compileGeneratedScaffold(targetUri, "test scaffold");
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.StubForgeDeploymentScriptCommand,
				async (contract: TestFile): Promise<void> => {
					const contractName = contract.fileName.replace(/\.sol$/, "");
					const abi = abiProvider.abis.find(a => a.fileName === contract.fileName)?.abi;

					if (!abi) {
						vscode.window.showErrorMessage(`ABI not found for ${abiProvider.abis.length} ABIs`);
						return;
					}

					const stubTestProvider = new StubTestProvider(
						contractName,
						abi,
						logger,
						foundryProjectController.getConfig()
					);
					const targetUri = await stubTestProvider.generateDeploymentScriptFile(contract.filePath);
					await compileGeneratedScaffold(targetUri, "deployment script");
				}
			),
			vscode.commands.registerCommand(ForgeCockpitCommand.ShowForgeCockPitCommand, (): void => {
				initWebView(context);
				vscode.commands.executeCommand(ForgeCockpitCommand.PinEditorCommand);
			}),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.GetProjectStatusCommand,
				(): LocalProjectState => {
					return foundryProjectController.getLocalProjectState();
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.GetCockpitSettingsCommand,
				(): CockpitSettings => {
					return foundryProjectController.getCockpitSettings();
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.UpdateCockpitSettingCommand,
				async (setting: CockpitSettingUpdate): Promise<CockpitSettings> => {
					return foundryProjectController.updateCockpitSetting(setting);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.RebuildProjectCommand,
				async (): Promise<LocalProjectState> => {
					return rebuildAndRefreshProject();
				}
			),
			vscode.languages.registerCodeLensProvider(
				{ language: "solidity", pattern: "**/*.sol" },
				codeLensProvider
			),
			vscode.languages.registerHoverProvider(
				{ language: "solidity", pattern: "**/*.sol" },
				hoverProvider
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.RunTestCommand,
				async (contract: SingleTest): Promise<void> => {
					await runTestWithRetry(contract, false);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.RunTestViaIRCommand,
				async (contract: SingleTest): Promise<void> => {
					await runTestWithRetry(contract, true);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.RunGroupCommand,
				async (path: string): Promise<void> => {
					const runSucceeded = await testingProvider.runGroup(path);
					if (runSucceeded) {
						return;
					}

					const rebuildSucceeded = await rebuildProjectIfPossible();
					if (!rebuildSucceeded) {
						return;
					}
					await testingProvider.runGroup(path);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.RefreshTestsCommand,
				async (): Promise<void> => {
					await Promise.all([
						testingProvider.refreshTests(),
						abiProvider.refresh(),
						foundryProjectController.refreshLocalProjectState(),
					]);
					ForgeCockPitPanel.sendContracts(abiProvider.abis);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.ForkNodeCommand,
				async (forkDetails: ForkInfo): Promise<any> => {
					const [node, cachedNodes] = await Promise.all([
						foundryProjectController.forkNode(forkDetails),
						context.globalState.get<string[]>(ACTIVE_NODE_KEY),
					]);

					if (node.success) {
						const newNodeUrl = `http://localhost:${node.port}`;
						const existingNodes = Array.isArray(cachedNodes) ? cachedNodes : [];
						const updatedNodes = [...existingNodes, newNodeUrl];
						await context.globalState.update(ACTIVE_NODE_KEY, updatedNodes);
					}

					return node;
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.WalletBalancesCommand,
				async (info: WalletBalancesInfo): Promise<any> => {
					const walletProvider = new WalletProvider(info.nodeUrl, logger);
					return await walletProvider.getBalances(info.wallets);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.LoadCockPitWalletsCommand,
				async (): Promise<any> => {
					const wallets = await foundryProjectController.loadWallets();
					ForgeCockPitPanel.sendDefaultWallets(WebviewCommand.LoadCockpitWallets, wallets);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.ExecuteFunctionCommand,
				async (callInfo: FunctionCall): Promise<any> => {
					const walletProvider = new WalletProvider(callInfo.nodeUrl, logger);
					const abi = abiProvider.abis.find(a => a.fileName === callInfo.contractAddress)?.abi;

					return await walletProvider.executeFunction({
						...callInfo,
						abi: abi ?? callInfo.abi,
					});
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.StopNodeCommand,
				async (port: string): Promise<boolean> => {
					const success = await foundryProjectController.stopForkNode(port);
					const cachedNodes = context.globalState.get<string[]>(ACTIVE_NODE_KEY);

					if (success && cachedNodes) {
						const newNodes = cachedNodes?.filter(url => !url.includes(port));
						await context.globalState.update(ACTIVE_NODE_KEY, newNodes);
						ForgeCockPitPanel.sendActiveNodes(WebviewCommand.GetActiveNodesCommand);
					}
					return success;
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.DeployContractCommand,
				async (config: DeployContract): Promise<any> => {
					const walletProvider = new WalletProvider(config.nodeUrl, logger);
					return await walletProvider.deployContract(config);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.TransferCommand,
				async (info: TransferTransaction): Promise<any> => {
					const walletProvider = new WalletProvider(info.nodeUrl, logger);
					return await walletProvider.transfer(info);
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.GetActiveNodesCommand,
				async (): Promise<any> => {
					const nodes = await foundryProjectController.getActiveNodes();
					const cachedNodes = (await context.globalState.get<string[]>(ACTIVE_NODE_KEY)) ?? [];

					const anvilNodeChecks = await Promise.all(
						cachedNodes.map(async nodeUrl => {
							const walletProvider = new WalletProvider(nodeUrl, logger);
							const isAnvil = await walletProvider.isAnvilNode();
							return isAnvil ? nodeUrl.split(":")[2] : null;
						})
					);

					const anvilNodes = anvilNodeChecks.filter(
						(nodeUrl): nodeUrl is string => nodeUrl !== null
					);

					const allNodes = [...new Set([...nodes, ...anvilNodes])];
					logger.logToOutput(`Found ${allNodes} anvil cached nodes`);
					return allNodes;
				}
			),
			vscode.commands.registerCommand(ForgeCockpitCommand.ShowBuildOutputCommand, (): void => {
				logger.showBuildOutput();
			}),
			vscode.commands.registerCommand(ForgeCockpitCommand.OpenUrlCommand, (url: string): void => {
				vscode.commands.executeCommand(ForgeCockpitCommand.VsOpenUrlCommand, vscode.Uri.parse(url));
			}),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.ClearCacheCommand,
				async (): Promise<void> => {
					const cachedNodes = context.globalState.get<string[]>(ACTIVE_NODE_KEY);
					if (cachedNodes) {
						await Promise.all(
							cachedNodes.map(nodeUrl => {
								const port = nodeUrl.split(":")[2];
								return vscode.commands.executeCommand(ForgeCockpitCommand.StopNodeCommand, port);
							})
						);
					}
					await context.globalState.update(ACTIVE_NODE_KEY, []);
					ForgeCockPitPanel.sendActiveNodes(WebviewCommand.GetActiveNodesCommand);
					logger.logToOutput("Cleared Cache");
				}
			),
			vscode.commands.registerCommand(
				ForgeCockpitCommand.RunScriptCommand,
				async (config: DeployContract): Promise<any> => {
					const walletProvider = new WalletProvider(config.nodeUrl, logger);
					const chainId = await walletProvider.chainId();
					const contract = abiProvider.abis.find(
						contract => contract.fileName === config.contractName
					);

					if (!contract) {
						return {
							success: false,
							contracts: [
								{
									contractName: config.contractName,
									address: "",
									success: false,
									hash: "",
									nodeUrl: config.nodeUrl,
									logs: undefined,
								} as DeployedContract,
							],
							scriptName: config.contractName,
						} as ScriptResponse;
					}

					return await foundryProjectController.runScript({
						...config,
						chainId,
						scriptName: contract.solFileName,
					});
				}
			)
		);

		context.subscriptions.push(
			actionsTreeView,
			{ dispose: () => decorationProvider.dispose() },
			{ dispose: () => testParserProvider.dispose() },
			{ dispose: () => testingProvider.dispose() }
		);

		vscode.window.showInformationMessage(`Forge Cockpit activated!`);
	}

	function initWebView(context: vscode.ExtensionContext): void {
		ForgeCockPitPanel.render(context);
	}
}
