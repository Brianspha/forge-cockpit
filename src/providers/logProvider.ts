import * as vscode from "vscode";
import { ForgeCockpitCommand } from "../utils";

export class CockPitLogProvider {
	private outputChannel: vscode.OutputChannel;
	private buildStatusBar: vscode.StatusBarItem;
	private rebuildStatusBar: vscode.StatusBarItem;

	constructor() {
		this.outputChannel = vscode.window.createOutputChannel("Forge Cockpit Logs");
		this.buildStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		this.rebuildStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
		this.buildStatusBar.name = "Forge cockpit Build Status";
		this.buildStatusBar.command = ForgeCockpitCommand.ShowBuildOutputCommand;
		this.buildStatusBar.tooltip = "Forge cockpit Build Status - Click to show output";
		this.rebuildStatusBar.name = "Forge cockpit Rebuild Foundry Project";
		this.rebuildStatusBar.text = "$(refresh) Rebuild Foundry Project";
		this.rebuildStatusBar.command = ForgeCockpitCommand.RebuildProjectCommand;
		this.rebuildStatusBar.tooltip = "Rebuild the active Foundry project";
		this.buildStatusBar.hide();
		this.rebuildStatusBar.hide();
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
		if (this.rebuildStatusBar) {
			this.rebuildStatusBar.dispose();
		}
	}
	public updateStatusBar(message: string, theme?: vscode.ThemeColor): void {
		this.buildStatusBar.text = message;
		this.buildStatusBar.backgroundColor =
			theme ?? new vscode.ThemeColor("statusBarItem.successBackground");
		this.buildStatusBar.show();
		this.rebuildStatusBar.show();
	}
}
