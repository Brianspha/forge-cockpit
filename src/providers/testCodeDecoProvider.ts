import * as vscode from "vscode";

export class TestDecorationProvider {
	private decorationType: vscode.TextEditorDecorationType;
	private activeEditor: vscode.TextEditor | undefined;

	constructor() {
		this.decorationType = vscode.window.createTextEditorDecorationType({
			before: {
				contentText: "",
				color: "#6a9955",
				margin: "0 0 0 2.5em",
				fontStyle: "italic",
			},
			isWholeLine: true,
		});

		vscode.window.onDidChangeActiveTextEditor(editor => {
			this.activeEditor = editor;
			if (editor) {
				this.updateDecorations();
			}
		});

		vscode.workspace.onDidChangeTextDocument(event => {
			if (this.activeEditor && event.document === this.activeEditor.document) {
				this.updateDecorations();
			}
		});

		this.activeEditor = vscode.window.activeTextEditor;
		if (this.activeEditor) {
			this.updateDecorations();
		}
	}

	private updateDecorations() {
		const document = this.activeEditor?.document;
		if (
			this.activeEditor &&
			document?.fileName.match(/[tT]\.sol$/) &&
			!document?.fileName.match(/[tT]\.s.sol$/)
		) {
			const text = document.getText();
			const decorations: vscode.DecorationOptions[] = [];

			const functionRegex = /function\s+(test\w+)\s*\(/g;
			let match;

			while ((match = functionRegex.exec(text)) !== null) {
				const startPos = document.positionAt(match.index);

				if (startPos.line > 0) {
					const prevLine = new vscode.Position(startPos.line - 1, 0);
					const range = new vscode.Range(prevLine, prevLine);
					decorations.push({ range });
				}
			}

			this.activeEditor.setDecorations(this.decorationType, decorations);
		}
	}

	public dispose() {
		this.decorationType.dispose();
	}
}
