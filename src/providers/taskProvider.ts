import * as vscode from "vscode";
import { CustomTaskDefinition } from "../types";
import { FoundryProjectController } from "../controllers/forgeProjectController";
import { ForgeCockpitCommand } from "../utils";
import { CockPitLogProvider } from "./logProvider";

export class FoundryTaskProvider implements vscode.TaskProvider {
	private tasks = new Map<string, vscode.Task>();
	private executions = new Map<string, vscode.TaskExecution>();
	private taskEndListener: vscode.Disposable;

	constructor(
		private controller: FoundryProjectController,
		private logger: CockPitLogProvider
	) {
		this.controller = controller;
		this.taskEndListener = vscode.tasks.onDidEndTaskProcess(e => this.handleTaskEnd(e));
	}

	private handleTaskEnd(e: vscode.TaskProcessEndEvent): void {
		for (const [taskId, execution] of this.executions) {
			if (e.execution === execution) {
				const task = execution.task;
				const definition = task.definition as CustomTaskDefinition;
				if (definition.command === "fork") {
					vscode.commands.executeCommand(ForgeCockpitCommand.GetActiveNodesCommand);
					this.closeTaskTerminal(task.name);
				}
				this.executions.delete(taskId);
				this.tasks.delete(taskId);
				break;
			}
		}
	}

	provideTasks(): Thenable<vscode.Task[]> | undefined {
		return this.getFoundryTasks();
	}

	resolveTask(task: vscode.Task): vscode.Task | undefined {
		const definition = task.definition as CustomTaskDefinition;
		return definition.type === "foundry" ? this.createFoundryTask(definition) : undefined;
	}

	private async getFoundryTasks(): Promise<vscode.Task[]> {
		if (!this.controller.isFoundry()) {
			return [];
		}
		return [];
	}

	private createFoundryTask(definition: CustomTaskDefinition): vscode.Task {
		const config = this.controller.getConfig();
		let execution: vscode.ShellExecution;
		let taskName: string;

		switch (definition.command) {
			case "test": {
				const testArgs = ["test"];
				if (definition.testName) {
					testArgs.push("--match-test", definition.testName);
				}
				if (definition.contractFile) {
					testArgs.push("--match-path", definition.contractFile);
				}
				if (config.viaIR) {
					testArgs.push("--via-ir");
				}
				testArgs.push(config.verbosity);

				execution = new vscode.ShellExecution("forge", testArgs.filter(Boolean), {
					cwd: config.workspaceRoot.fsPath,
				});

				taskName = `Foundry: Test ${definition.testName || "All"}`;
				break;
			}

			case "fork": {
				const port = definition.port;
				const nodeUrl = definition.nodeUrl || "";

				const anvilArgs = ["--port", port, "--auto-impersonate"];
				if (nodeUrl) {
					anvilArgs.unshift("--fork-url", nodeUrl);
				}

				execution = new vscode.ShellExecution("anvil", anvilArgs, {
					cwd: config.workspaceRoot.fsPath,
				});

				taskName = `Foundry: Fork ${nodeUrl || "Local"} (${port})`;
				break;
			}

			default:
				throw new Error(`Unknown foundry command: ${definition.command}`);
		}

		const task = new vscode.Task(
			definition,
			vscode.TaskScope.Workspace,
			taskName,
			"foundry",
			execution
		);

		if (definition.command === "fork") {
			task.isBackground = true;
			task.problemMatchers = [];
			task.presentationOptions = {
				reveal: vscode.TaskRevealKind.Never,
				focus: false,
				panel: vscode.TaskPanelKind.Dedicated,
				showReuseMessage: false,
				clear: false,
			};
		} else {
			task.group = vscode.TaskGroup.Test;
			task.presentationOptions = {
				reveal: vscode.TaskRevealKind.Always,
				focus: true,
				panel: vscode.TaskPanelKind.Dedicated,
				showReuseMessage: false,
				clear: true,
			};
		}

		const taskId = this.getTaskId(definition);
		this.tasks.set(taskId, task);
		return task;
	}

	public async executeTask(definition: CustomTaskDefinition): Promise<vscode.TaskExecution> {
		const task = this.createFoundryTask(definition);
		const execution = await vscode.tasks.executeTask(task);
		this.executions.set(definition.port, execution);
		return execution;
	}

	public async terminateTaskByType(forkType: string): Promise<void> {
		const runningTasks = vscode.tasks.taskExecutions;
		for (const execution of runningTasks) {
			const task = execution.task;
			const taskDef = task.definition as CustomTaskDefinition;
			if (taskDef.command === forkType) {
				await this.terminateTask(taskDef.port);
				break;
			}
		}
	}

	public async terminateTask(port: string): Promise<boolean> {
		const execution = this.executions.get(port);
		if (execution) {
			try {
				const task = execution.task;
				execution.terminate();
				await this.closeTaskTerminal(task.name);

				this.executions.delete(port);
				this.tasks.delete(port);
				return true;
			} catch (error) {
				this.logger.logToOutput(`Error disposing task ${port}:${error}`);
				return false;
			}
		}

		const runningTasks = vscode.tasks.taskExecutions;
		for (const execution of runningTasks) {
			const task = execution.task;
			const taskDef = task.definition as CustomTaskDefinition;

			if (taskDef.port === port) {
				try {
					execution.terminate();
					await this.closeTaskTerminal(task.name);
					return true;
				} catch (error) {
					this.logger.logToOutput(`Error disposing task by port: ${error}`);
					return false;
				}
			}
		}

		if (await this.terminateTaskByTerminal(port)) {
			return true;
		}

		if (await this.terminateTaskByProcess(port)) {
			return true;
		}

		return false;
	}

	private async terminateTaskByTerminal(port: string): Promise<boolean> {
		const terminals = vscode.window.terminals;
		for (const terminal of terminals) {
			if (terminal.name.includes(port) || terminal.name.includes(`(${port})`)) {
				this.logger.logToOutput(`Found terminal for port ${port}: ${terminal.name}`);
				terminal.dispose();
				return true;
			}
		}
		return false;
	}

	private async terminateTaskByProcess(port: string): Promise<boolean> {
		try {
			await vscode.commands.executeCommand(ForgeCockpitCommand.TerminateAllTasksCommand);
			this.logger.logToOutput(`Terminated all tasks as fallback for port ${port}`);
			return true;
		} catch (error) {
			this.logger.logToOutput(`Error terminating all tasks: ${error}`);
			return false;
		}
	}

	public getRunningTasks(): Map<string, vscode.TaskExecution> {
		return new Map(this.executions);
	}

	public isTaskRunning(taskId: string): boolean {
		return this.executions.has(taskId);
	}

	private getTaskId(definition: CustomTaskDefinition): string {
		let id = `foundry-${definition.command}`;
		if (definition.port) {
			id += `-${definition.port}`;
		}
		if (definition.testName) {
			id += `-${definition.testName}`;
		}
		return id;
	}

	private async closeTaskTerminal(taskName: string): Promise<void> {
		const terminals = vscode.window.terminals;
		for (const terminal of terminals) {
			if (terminal.name === taskName || terminal.name.includes(taskName)) {
				terminal.dispose();
				break;
			}
		}
	}

	public async closeAllTaskTerminals(): Promise<void> {
		const terminals = vscode.window.terminals;
		for (const terminal of terminals) {
			if (terminal.name.startsWith("Foundry:") || terminal.name.includes("foundry")) {
				terminal.dispose();
			}
		}
	}

	public dispose(): void {
		this.taskEndListener.dispose();
		for (const [, execution] of this.executions) {
			const task = execution.task;
			execution.terminate();
			this.closeTaskTerminal(task.name);
		}
		this.executions.clear();
		this.tasks.clear();
	}
}
