import * as vscode from "vscode";

export class SettingItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly settingId: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.contextValue = "setting";

		const config = vscode.workspace.getConfiguration("forge-cockpit");
		const currentValue = config.get(settingId);
		this.tooltip = `${this.label}: ${currentValue}`;

		if (typeof currentValue === "boolean") {
			this.description = currentValue ? "Enabled" : "Disabled";
			this.iconPath = currentValue ? new vscode.ThemeIcon("check") : new vscode.ThemeIcon("dash");
		} else {
			this.description = currentValue?.toString() || "";
			this.iconPath = new vscode.ThemeIcon("gear");
		}
	}
}
