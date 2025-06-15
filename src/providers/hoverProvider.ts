import * as vscode from "vscode";
import * as path from "path";
import { FoundryProjectController } from "../controllers/forgeProjectController";
import { SingleTest } from "../types";

export class TestHoverProvider implements vscode.HoverProvider {
	constructor(private foundryManager: FoundryProjectController) {}

	async provideHover(
		document: vscode.TextDocument,
		position: vscode.Position
	): Promise<vscode.Hover | null> {
		if (!document.fileName.match(/[tT]\.sol$/)) {
			return null;
		}

		const wordRange = document.getWordRangeAtPosition(position);
		if (!wordRange) {
			return null;
		}

		const word = document.getText(wordRange);

		if (!word.startsWith("test")) {
			return null;
		}

		const lineText = document.lineAt(position.line).text;
		if (!lineText.includes("function")) {
			return null;
		}
		const fileName = path.basename(document.fileName);

		const runTestCommand = vscode.Uri.parse(
			`command:forge-cockpit.runTest?${encodeURIComponent(
				JSON.stringify({
					contractName: fileName,
					testName: word,
				} as SingleTest)
			)}`
		);
		const runTestCommandViaIR = vscode.Uri.parse(
			`command:forge-cockpit.runTestViaIR?${encodeURIComponent(
				JSON.stringify({
					contractName: fileName,
					testName: word,
				} as SingleTest)
			)}`
		);
		const hoverContent = new vscode.MarkdownString(
			`**Forge Test**: \`${word}\`\n\n` +
				`[Run Test](${runTestCommand}) | [Run Test via IR](${runTestCommandViaIR})`
		);

		hoverContent.isTrusted = true;

		return new vscode.Hover(hoverContent, wordRange);
	}
}
