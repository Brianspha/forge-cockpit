import * as vscode from "vscode";
import { TestFile } from "../types";

export class TestItem extends vscode.TreeItem {
	constructor(
		public readonly test: TestFile,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly iconPath?: vscode.ThemeIcon
	) {
		super(test.fileName, collapsibleState);

		if (!this.test.isFolder) {
			this.contextValue = "testItem";
			this.iconPath = new vscode.ThemeIcon("play");
		} else {
			this.contextValue = "testGroup";
			this.iconPath = new vscode.ThemeIcon("folder");
			this.description = "";
			this.command = {
				command: "forge-cockpit.runGroup",
				title: "Run All Tests in Group",
				arguments: [this.test.tests],
			};
		}
	}
}
