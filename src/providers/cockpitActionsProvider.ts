import * as vscode from "vscode";
import { CockPitActionItem } from "../items/cockPitItem";
import { ForgeCockpitCommand } from "../utils";

export class CockPitActionsProvider implements vscode.TreeDataProvider<CockPitActionItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<CockPitActionItem | undefined | null | void> =
		new vscode.EventEmitter<CockPitActionItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<CockPitActionItem | undefined | null | void> =
		this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: CockPitActionItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: CockPitActionItem): Thenable<CockPitActionItem[]> {
		if (element) {
			return Promise.resolve([]);
		}

		const items: CockPitActionItem[] = [];

		items.push(
			new CockPitActionItem(
				"Open Cockpit",
				"Open the Forge Cockpit panel",
				{
					command: ForgeCockpitCommand.ShowForgeCockPitCommand,
					title: "Open Cockpit",
				},
				"play"
			),
			new CockPitActionItem(
				"Clear Cockpit Cache",
				"Clear Forge Cockpit cache",
				{
					command: ForgeCockpitCommand.ClearCacheCommand,
					title: "Clear Cache",
				},
				"notebook-delete-cell"
			)
		);

		return Promise.resolve(items);
	}
}
