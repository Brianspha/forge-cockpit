import * as vscode from "vscode";

export class CockPitLogProvider {
	private outputChannel: vscode.OutputChannel;
	private buildStatusBar: vscode.StatusBarItem;

	constructor() {
		this.outputChannel = vscode.window.createOutputChannel("Forge Cockpit Logs");
		this.buildStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		this.buildStatusBar.name = "Forge cockpit Build Status";
		this.buildStatusBar.command = "forge-cockpit.showBuildOutput";
		this.buildStatusBar.tooltip = "Forge cockpit Build Status - Click to show output";
		this.buildStatusBar.hide();
		this.showBuildOutput();
	}
	public showBuildOutput(): void {
		this.outputChannel.show();
	}

	public logToOutput(message: string): void {
		const timestamp = new Date().toLocaleTimeString();
		this.outputChannel.appendLine(`[${timestamp}] Forge cockpit ${message}`);
	}
	public dispose(): void {
		if (this.outputChannel) {
			this.outputChannel.dispose();
		}
		if (this.buildStatusBar) {
			this.buildStatusBar.dispose();
		}
	}
	public updateStatusBar(message: string, theme?: vscode.ThemeColor): void {
		this.buildStatusBar.hide();
		this.buildStatusBar.text = message;
		this.buildStatusBar.backgroundColor =
			theme ?? new vscode.ThemeColor("statusBarItem.successBackground");
	}
}
