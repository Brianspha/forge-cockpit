import __getWebviewHtml__ from "@tomjs/vite-plugin-vscode/webview";
import {
	Disposable,
	Webview,
	WebviewPanel,
	window,
	Uri,
	ViewColumn,
	commands,
	env,
	ExtensionContext,
} from "vscode";
import {
	TestFile,
	ForkDetails,
	WalletBalancesInfo,
	FunctionCall,
	FunctionCallResponse,
	ForkInfo,
	DeployContract,
	ScriptResponse,
	AbiInputData,
	TransferTransaction,
	TransferResponse,
} from "../types";
import {
	encodeFunction,
	ForgeCockpitCommand,
	ForgeCockPitResponseCommand,
	ClipBoardTypeCommand,
	WebviewCommand,
} from "../utils";
import { getNonce } from "../utils/getNonce";

export class ForgeCockPitPanel {
	public static currentPanel: ForgeCockPitPanel | undefined;
	private readonly _panel: WebviewPanel;
	private _disposables: Disposable[] = [];

	private constructor(panel: WebviewPanel, context: ExtensionContext) {
		this._panel = panel;

		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		this._panel.webview.html = this._getWebviewContent(this._panel.webview, context);

		this._setWebviewMessageListener(this._panel.webview);
	}

	public static render(context: ExtensionContext) {
		if (ForgeCockPitPanel.currentPanel) {
			ForgeCockPitPanel.currentPanel._panel.reveal(ViewColumn.One);
		} else {
			const panel = window.createWebviewPanel("showForgeCockPit", "Forge CockPit", ViewColumn.One, {
				retainContextWhenHidden: true,
				enableScripts: true,
				localResourceRoots: [Uri.joinPath(context.extensionUri, "dist")],
			});

			ForgeCockPitPanel.currentPanel = new ForgeCockPitPanel(panel, context);
		}
	}
	public static isVisible(): boolean {
		return ForgeCockPitPanel.currentPanel?._panel.active ?? false;
	}

	public static exists(): boolean {
		return ForgeCockPitPanel.currentPanel !== undefined;
	}
	public dispose() {
		ForgeCockPitPanel.currentPanel = undefined;

		this._panel.dispose();

		while (this._disposables.length) {
			const disposable = this._disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

	private _getWebviewContent(webview: Webview, context: ExtensionContext): string {
		if (process.env.VITE_DEV_SERVER_URL) {
			return __getWebviewHtml__({
				serverUrl: process.env.VITE_DEV_SERVER_URL,
				webview,
				context,
				injectCode: `<script>window.__FLAG1__=666;window.__FLAG2__=888;</script>`,
			});
		}
		const styleUri = webview.asWebviewUri(
			Uri.joinPath(context.extensionUri, "dist", "assets", "index.css")
		);
		const scriptUri = webview.asWebviewUri(
			Uri.joinPath(context.extensionUri, "dist", "assets", "index.js")
		);
		const nonce = getNonce();

		const html = `
			<!DOCTYPE html>
			<html lang="en">
			<head>
			<meta charset="UTF-8" />
			<meta http-equiv="Content-Security-Policy"
					content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';" />
			<link href="${styleUri}" rel="stylesheet" nonce="${nonce}" />
			</head>
			<body>
			<div id="app"></div>
			<script nonce="${nonce}" type="module" src="${scriptUri}">
			<script nonce="${nonce}">
			</script> 
			</script>
			</body>
			</html>
			`;
		commands.executeCommand("forge-cockpit.log", html);
		return html;
	}

	private _setWebviewMessageListener(webview: Webview) {
		webview.onDidReceiveMessage(
			async (message: any) => {
				const command = message.command;
				const payload = this.toSafePayload(message.payload);

				switch (command) {
					case WebviewCommand.GetActiveNodesCommand:
						await ForgeCockPitPanel.sendActiveNodes(command);
						break;
					case WebviewCommand.StopNodeCommand:
						const stopped = (await commands.executeCommand(
							ForgeCockpitCommand.StopNodeCommand,
							payload
						)) as boolean;
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.StopNodeResponse,
							payload: stopped,
							previousType: command.toString(),
						});
						break;

					case WebviewCommand.DeployContractCommand:
						const contractInfo = payload as DeployContract;
						const DeployedContract = await commands.executeCommand(
							ForgeCockpitCommand.DeployContractCommand,
							contractInfo
						);
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.DeployContractResponse,
							payload: DeployedContract,
							previousType: command.toString(),
						});
						break;

					case WebviewCommand.WalletBalancesCommand:
						const walletInfo = payload as WalletBalancesInfo;
						const balances = (await commands.executeCommand(
							ForgeCockpitCommand.WalletBalancesCommand,
							walletInfo
						)) as string[];
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.WalletBalancesResponse,
							payload: balances,
							previousType: command.toString(),
						});
						break;

					case WebviewCommand.ExecuteFunctionCommand:
						const transaction = payload as FunctionCall;
						const response = (await commands.executeCommand(
							ForgeCockpitCommand.ExecuteFunctionCommand,
							transaction
						)) as FunctionCallResponse;
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.ExecuteFunctionResponse,
							payload: response,
							previousType: transaction.caller,
						});
						break;
					case WebviewCommand.TransferCommand:
						const balanceResponse = (await commands.executeCommand(
							ForgeCockpitCommand.TransferCommand,
							payload as TransferTransaction
						)) as TransferResponse;
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.TransferResponse,
							payload: JSON.stringify(balanceResponse),
							previousType: command.toString(),
							previousPayload: payload,
						});
						break;
					case ClipBoardTypeCommand.ReadWalletImportCommand:
					case ClipBoardTypeCommand.ReadClipboardWalletCommand:
					case ClipBoardTypeCommand.ReadClipboardDeploymentCommand:
					case ClipBoardTypeCommand.ReadClipboardAnvilCommand:
					case ClipBoardTypeCommand.ReadClipboardConstructorArgsCommand:
					case ClipBoardTypeCommand.ReadClipboardFunctionInputCommand:
					case ClipBoardTypeCommand.ReadClipboardEncoderCommand:
					case ClipBoardTypeCommand.ReadTransferCommand:
					case ClipBoardTypeCommand.ReadClipboard:
						const text = await env.clipboard.readText();
						window.showInformationMessage(`Read from clipboard ${JSON.stringify(text)}`);
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.ClipboardContentResponse,
							payload: JSON.stringify(text),
							previousType: command.toString(),
							previousPayload: payload,
						});
						break;
					case WebviewCommand.WriteClipboardCommand:
						window.showInformationMessage("Copied to Clipboard");
						await env.clipboard.writeText(JSON.stringify(payload));
						break;
					case WebviewCommand.RunScriptCommand:
						const scriptResults = (await commands.executeCommand(
							ForgeCockpitCommand.RunScriptCommand,
							payload as DeployContract
						)) as ScriptResponse;
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.RunScriptResponse,
							payload: JSON.stringify(scriptResults),
							previousType: command.toString(),
						});
						break;
					case WebviewCommand.StopNodeCommand:
						commands.executeCommand(ForgeCockpitCommand.StopNodeCommand, payload);
						break;
					case WebviewCommand.OpenLinkCommand:
						commands.executeCommand(ForgeCockpitCommand.OpenUrlCommand, payload);
						break;
					case WebviewCommand.AbiEncodeCommand:
						const input = payload as AbiInputData;
						const encoded = encodeFunction(input);
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.AbiEncodeResponse,
							payload: JSON.stringify(encoded),
							previousType: command.toString(),
						});
						break;
					case WebviewCommand.RefreshContractsCommand:
					case WebviewCommand.LoadContractsCommand:
						commands.executeCommand(ForgeCockpitCommand.RefreshTestsCommand);
						commands.executeCommand(ForgeCockpitCommand.LoadCockPitWalletsCommand);
						return;
					case WebviewCommand.ForkNodeCommand:
						const results = (await commands.executeCommand(
							ForgeCockpitCommand.ForkNodeCommand,
							payload as ForkInfo
						)) as ForkDetails;
						const result = {
							...results,
							tabId: payload,
						};
						ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
							type: ForgeCockPitResponseCommand.ForkNodeResultsResponse,
							payload: result,
							previousType: "",
						});
						break;

					default:
						window.showInformationMessage(message);
				}
			},
			undefined,
			this._disposables
		);
	}
	public static sendDefaultWallets(command: string, wallets: string[]) {
		if (ForgeCockPitPanel.currentPanel) {
			ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
				type: ForgeCockPitResponseCommand.GetDefaultWalletsResponse,
				payload: wallets,
				previousType: command.toString(),
			});
		}
	}
	public static sendContracts(contracts: TestFile[]) {
		if (ForgeCockPitPanel.currentPanel) {
			ForgeCockPitPanel.currentPanel._panel.webview.postMessage({
				type: ForgeCockPitResponseCommand.SetContractsResponse,
				payload: contracts,
			});
		}
	}
	public static async sendActiveNodes(command: any) {
		if (ForgeCockPitPanel.currentPanel) {
			const nodes = await commands.executeCommand(ForgeCockpitCommand.GetActiveNodesCommand);
			ForgeCockPitPanel.currentPanel?._panel.webview.postMessage({
				type: ForgeCockPitResponseCommand.GetActiveNodesResponse,
				payload: nodes as string[],
				previousType: command.toString(),
			});
		}
	}

	private toSafePayload(payload: any): string | Object {
		if (typeof payload === "string") {
			try {
				return JSON.parse(payload);
			} catch (e) {
				return payload;
			}
		}
		return payload;
	}
}
