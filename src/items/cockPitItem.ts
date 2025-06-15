import * as vscode from "vscode";

export class CockPitActionItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly tooltip: string,
		public readonly command: vscode.Command,
		iconName: string
	) {
		super(label, vscode.TreeItemCollapsibleState.None);
		this.tooltip = tooltip;
		this.command = command;
		this.iconPath = new vscode.ThemeIcon(iconName);
	}
}
