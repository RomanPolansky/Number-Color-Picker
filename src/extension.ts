import { ExtensionContext } from 'vscode';
import ColorPicker from './ColorPicker';

export function activate(context: ExtensionContext) {
	const picker = new ColorPicker();
	context.subscriptions.push(picker);
}

// this method is called when your extension is deactivated
export function deactivate() {}
