import { languages, workspace, TextDocumentChangeEvent, Disposable } from 'vscode';
import ColorProvider from './ColorProvider';

interface IExtensionContextSubscriptions { dispose(): any }
export default class ColorPicker implements IExtensionContextSubscriptions {
	constructor() {
		const subscriptions: Disposable[] = [];
        workspace.onDidChangeTextDocument(this._onDidChangeTextDocument, this, subscriptions);
        workspace.onDidChangeConfiguration(this._onDidChangeConfiguration, this, subscriptions);
		this.register();
	}

    private _onDidChangeTextDocument(e: TextDocumentChangeEvent) {}
	private _onDidChangeConfiguration() {}

	private register() {
		const configurationLanguages = workspace.getConfiguration('number-color-picker').get('languages') as string[];
		configurationLanguages.forEach((language) => {
			languages.registerColorProvider(language, new ColorProvider());
		});
	}

	dispose() {}
}
