import * as vscode from 'vscode';
import Color from './color';

const regexpNumberHexColor = /(?<!\w)0x[a-fA-F0-9]{6}(?!\w)/g;

interface Match {
	color: vscode.Color;
	type: string;
	length: number;
	range: vscode.Range;
}

function vsCodeColorFromHex(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	const r = parseInt(result[1], 16) / 255;
	const g = parseInt(result[2], 16) / 255;
	const b = parseInt(result[3], 16) / 255;

	return new vscode.Color(r, g, b, 1);
}

function getPos(text: string, index: number): vscode.Position {
	const nMatches = Array.from(text.slice(0, index).matchAll(/\n/g));
	
	const lineNumber = nMatches.length;

	let characterIndex: number;
	if (lineNumber === 0) {
		characterIndex = index + 1;
	} else {
		characterIndex = index - nMatches[lineNumber-1].index;
	}

	return new vscode.Position(
		lineNumber,
		characterIndex - 1
	);
}


class Matcher {
	// TODO validate values
	static getMatches(text: string) {
		const matches = text.matchAll(regexpNumberHexColor);
		return Array.from(matches).map((match) => {
			const colorString = `#${match[0].slice(2)}`;
			const length = colorString.length;

			const range = new vscode.Range(
				getPos(text, match.index!),
				getPos(text, match.index! + colorString.length + 1)
			);

			const col = vsCodeColorFromHex(colorString); 

			if(col) {
				return {
					color: col,
					type: "rgb",
					length,
					range
				} as Match;
			}
		});
	}
}


class Picker {
	constructor() {
		const subscriptions: vscode.Disposable[] = [];
        vscode.workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subscriptions);
        vscode.workspace.onDidChangeConfiguration(this._onDidChangeConfiguration, this, subscriptions);
		this.register();
	}

	private get languages() {
		return vscode.workspace.getConfiguration('vscode-color-picker').get('languages') as string[];
	}

    private _onDidChangeTextDocument(e: vscode.TextDocumentChangeEvent) {}
	private _onDidChangeConfiguration() {}

	private register() {
		this.languages.forEach(language => {
			vscode.languages.registerColorProvider(language, {
				provideDocumentColors(document) {
					const matches = Matcher.getMatches(document.getText());
					return matches.map((match) => {
						const colorInformation = new vscode.ColorInformation(match!.range, match!.color);
						return colorInformation;
					});
				},
				provideColorPresentations(color) {
					const c = Color.fromRgb(color.red * 255, color.green * 255, color.blue * 255);
					const numberPresentation = `0x${c.toString('hex').slice(1)}`;
					const presentationHex = new vscode.ColorPresentation(numberPresentation);

					return [presentationHex];
				}
			});
		});
	}

	dispose() {}
}



export function activate(context: vscode.ExtensionContext) {
	const picker = new Picker();
	context.subscriptions.push(picker);
}

// this method is called when your extension is deactivated
export function deactivate() {}
