// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-whitespace-replacer" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-whitespace-replacer.replaceEscapedWhitespace', () => {
		runReplacer(replaceEscapedWhitespace);
	});
	let disposable2 = vscode.commands.registerCommand('vscode-whitespace-replacer.escapeWhitespace', () => {
		runReplacer(replaceWhitespace);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function runReplacer(replacer: (value: string) => string) {
	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor) {
		return;  // No open text editor
	}
	textEditor.edit(function (editBuilder) {
		const selections = textEditor.selections;
		if (selections.some(s => !s.isEmpty)) {
			// At least one of the selections has text in it, so we only operate on those.
			selections.forEach(s => {
				if (s.isEmpty) {
					return;
				}

				const text = textEditor.document.getText(s);
				const fixedText = replacer(text);
				editBuilder.replace(s, fixedText);
			});
		} else {
			const firstLine = textEditor.document.lineAt(0);
			const lastLine = textEditor.document.lineAt(textEditor.document.lineCount - 1);
			const fullEditorRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
			const text = textEditor.document.getText(fullEditorRange);
			const fixedText = replacer(text);

			editBuilder.replace(fullEditorRange, fixedText);
		}
	});
}

function replaceWhitespace(value: string): string {
	const map: { [x: string]: string } = { '\n': '\\n', '\r': '\\r', '\t': '\\t', '\b': '\\b', '\v': '\\v', '\f': '\\f' };
	return value.replace(/[\n\r\t\b\v\f]/g, char => map[char]);
}
function replaceEscapedWhitespace(value: string): string {
	const map: { [x: string]: string } = { '\\n': '\n', '\\r': '\r', '\\t': '\t', '\\b': '\b', '\\v': '\v', '\\f': '\f' };
	return value.replace(/\\[nrtbvf]/g, escapedWhitespace => map[escapedWhitespace]);
}