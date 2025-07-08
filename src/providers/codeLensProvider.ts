import * as vscode from "vscode";
import { SingleTest, TestFile } from "../types";
import { ForgeCockpitCommand } from "../utils";
import { CockPitLogProvider } from "./logProvider";

export class TestCodeLensProvider implements vscode.CodeLensProvider {
	constructor(private logger: CockPitLogProvider) {}

	async provideCodeLenses(
		document: vscode.TextDocument,
		token: vscode.CancellationToken
	): Promise<vscode.CodeLens[]> {
		if (token.isCancellationRequested) {
			return [];
		}
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
			this.logger.logToOutput(`Current file is not a test file`);
			return;
		}

		const normalizedPath = this.normalizeTestPath(relativePath);
		const functionRegex = /^\s*function\s+(test\w+)\s*\(/gm;
		let match;

		while ((match = functionRegex.exec(text)) !== null) {
			const functionName = match[1];
			const position = document.positionAt(match.index);

			const functionKeywordIndex = match.index + match[0].indexOf("function");
			const functionKeywordPosition = document.positionAt(functionKeywordIndex);
			const range = new vscode.Range(
				functionKeywordPosition,
				functionKeywordPosition.with(
					undefined,
					functionKeywordPosition.character + "function".length + 1 + functionName.length
				)
			);

			const runTestCmd = {
				title: "forge test",
				command: ForgeCockpitCommand.RunTestCommand,
				arguments: [
					{
						contractName: normalizedPath,
						testName: functionName,
					} as SingleTest,
				],
			};

			const runTestViaIRCmd = {
				title: "forge test viaIR",
				command: ForgeCockpitCommand.RunTestViaIRCommand,
				arguments: [
					{
						contractName: normalizedPath,
						testName: functionName,
						viaIR: true,
					} as SingleTest,
				],
			};

			this.logger.logToOutput(`Found test for code lens function ${functionName}`);

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

		const normalizedPath = this.normalizeTestPath(relativePath);
		const contractRegex = /^\s*contract\s+(\w+)(?:\s+is\s+[^{]+)?\s*\{/gm;
		let match;

		while ((match = contractRegex.exec(text)) !== null) {
			const contractName = match[1];
			const position = document.positionAt(match.index);
			const contractKeywordIndex = match.index + match[0].indexOf("contract");
			const contractKeywordPosition = document.positionAt(contractKeywordIndex);
			const range = new vscode.Range(
				contractKeywordPosition,
				contractKeywordPosition.with(
					undefined,
					contractKeywordPosition.character + "contract".length + 1 + contractName.length
				)
			);

			const generateTestsCmd = {
				title: "Forge stub tests",
				command: ForgeCockpitCommand.StubForgeTestsCommand,
				arguments: [
					{
						fileName: contractName,
						filePath: normalizedPath,
					} as TestFile,
				],
			};

			codeLenses.push(new vscode.CodeLens(range, generateTestsCmd));
		}
	}

	private isNotTestOrScriptFile(fileName: string): boolean {
		return /^(?!.*\.(t|s)\.sol).*$/.test(fileName);
	}

	private normalizeTestPath(relativePath: string): string {
		const testIndex = relativePath.indexOf("/test/");
		if (testIndex !== -1) {
			return relativePath.substring(testIndex + 1);
		}

		if (relativePath.startsWith("test/")) {
			return relativePath;
		}

		return relativePath;
	}
}
