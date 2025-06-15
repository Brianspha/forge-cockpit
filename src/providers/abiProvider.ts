import * as vscode from "vscode";
import { FoundryProjectController } from "../controllers/forgeProjectController";
import { TestFile } from "../types";
import { CockPitLogProvider } from "./logProvider";

export class AbiProvider {
	public abis: TestFile[] = [];
	private watcher: vscode.FileSystemWatcher | undefined;
	private _onDidChangeAbis: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
	public readonly onDidChangeAbis: vscode.Event<void> = this._onDidChangeAbis.event;
	private debounceTimer: NodeJS.Timeout | undefined;

	constructor(
		private readonly foundryProjectController: FoundryProjectController,
		private readonly logger: CockPitLogProvider
	) {}

	initialize() {
		this.logger.updateStatusBar(
			"$(beaker~spin) Forge cockpit loading ABIs",
			new vscode.ThemeColor("statusBarItem.successBackground")
		);
		this.setupFileWatcher();
		this.foundryProjectController.onDidBuildSucceed(() => {
			this.refresh();
		});
		this.logger.updateStatusBar(
			"$(check) Forge cockpit ready",
			new vscode.ThemeColor("statusBarItem.successBackground")
		);
	}

	private async loadAbis() {
		try {
			this.abis = await this.foundryProjectController.getAllContractABIs();
		} catch (error) {}
	}

	private setupFileWatcher() {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length === 0) {
			return;
		}

		const outputDir = this.foundryProjectController.getConfig().outputDir || "out";

		try {
			const pattern = new vscode.RelativePattern(workspaceFolders[0], `${outputDir}/**/*.json`);

			this.watcher = vscode.workspace.createFileSystemWatcher(pattern);

			this.watcher.onDidCreate(() => this.triggerRefresh("create"));
			this.watcher.onDidChange(() => this.triggerRefresh("change"));
			this.watcher.onDidDelete(() => this.triggerRefresh("delete"));

			console.log(`Output watcher set up for ${outputDir}/**/*.json`);
		} catch (error) {
			console.error("Error setting up file watcher:", error);
		}
	}

	private triggerRefresh(source: string) {
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = setTimeout(async () => {
			await this.loadAbis();
			this._onDidChangeAbis.fire();
		}, 1000);
	}

	public async refresh() {
		await this.loadAbis();
		this._onDidChangeAbis.fire();
	}

	public async triggerBuild() {
		await this.foundryProjectController.triggerBuild();
	}

	dispose() {
		if (this.watcher) {
			this.watcher.dispose();
		}

		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}

		this.foundryProjectController.dispose();
		this._onDidChangeAbis.dispose();
	}
}
