import * as vscode from "vscode";
import { FoundryProjectController } from "../controllers/forgeProjectController";
import { DeployContract, SingleTest, TestFile } from "../types";
import { ForgeCockpitCommand } from "../utils";

export class TestCodeLensProvider implements vscode.CodeLensProvider {
	constructor(private foundryManager: FoundryProjectController) {}

	async provideCodeLenses(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): Promise<vscode.CodeLens[]> {
		const codeLenses: vscode.CodeLens[] = [];
		const text = document.getText();
		const relativePath = vscode.workspace.asRelativePath(document.fileName);
		this.addTestFunctionLenses(document, text, relativePath, codeLenses);
		this.addContractLenses(document, text, relativePath, codeLenses);

		return codeLenses;
	}

	private addTestFunctionLenses(
		document: vscode.TextDocument,
		text: string,
		relativePath: string,
		codeLenses: vscode.CodeLens[]
	): void {
		if (this.isNotTestOrScriptFile(relativePath)) {
			return;
		}
		const functionRegex = /function\s+(test\w+)\s*\(/g;
		let match;

		while ((match = functionRegex.exec(text)) !== null) {
			const functionName = match[1];
			const position = document.positionAt(match.index);
			const range = new vscode.Range(
				position,
				position.with(undefined, position.character + match[0].length)
			);

			const runTestCmd = {
				title: "forge test",
				command: ForgeCockpitCommand.RunTestCommand,
				arguments: [
					{
						contractName: relativePath,
						testName: functionName,
					} as SingleTest,
				],
			};

			const runTestViaIRCmd = {
				title: "forge test viaIR",
				command: ForgeCockpitCommand.RunTestViaIRCommand,
				arguments: [
					{
						contractName: relativePath,
						testName: functionName,
						viaIR: true,
					} as SingleTest,
				],
			};

			codeLenses.push(new vscode.CodeLens(range, runTestCmd));
			codeLenses.push(new vscode.CodeLens(range, runTestViaIRCmd));
		}
	}

	private addContractLenses(
		document: vscode.TextDocument,
		text: string,
		relativePath: string,
		codeLenses: vscode.CodeLens[]
	): void {
		if (!this.isNotTestOrScriptFile(relativePath)) {
			return;
		}
		const contractRegex = /contract\s+(\w+)(?:\s+is\s+|\s*\{)/g;
		let match;

		while ((match = contractRegex.exec(text)) !== null) {
			const contractName = match[1];
			const position = document.positionAt(match.index);
			const range = new vscode.Range(
				position,
				position.with(undefined, position.character + match[0].length - 1)
			);

			const generateTestsCmd = {
				title: "Forge stub tests",
				command: ForgeCockpitCommand.StubForgeTestsCommand,
				arguments: [
					{
						fileName: contractName,
						filePath: relativePath,
					} as TestFile,
				],
			};

			codeLenses.push(new vscode.CodeLens(range, generateTestsCmd));
		}
	}

	private isNotTestOrScriptFile(fileName: string): boolean {
		return /^(?!.*\.(t|s)\.sol).*$/.test(fileName);
	}

	private isScriptFile(fileName: string): boolean {
		return /\.s\.sol$/.test(fileName);
	}
}
