import { Position, Color, ColorPresentation, DocumentColorProvider, TextDocument, Range, ColorInformation } from 'vscode';
import { hexToVsCodeColor, vsCodeColorToHex } from './vsCodeColorConverter';

const regexpNumberHexColor = /(?<!\w)0x[a-fA-F0-9]{6}(?!\w)/g;
const colorStringLength = 8;

export default class ColorProvider implements DocumentColorProvider {
    static getPosition(text: string, index: number) {
        const nMatches = Array.from(text.slice(0, index).matchAll(/\n/g));
        const line = nMatches.length;
        let characterIndex: number;
        if (line === 0) { characterIndex = index; }
        else { characterIndex = index - nMatches[line - 1].index - 1; }
        return new Position(line, characterIndex);
    }
    
    static parseDocument(text: string) {
        const matches = text.matchAll(regexpNumberHexColor);
        return Array.from(matches).map((match) => {
            const [colorString] = match;
            const startPos = this.getPosition(text, match.index!);
            const endPos = new Position(startPos.line, startPos.character + colorStringLength);
            const range = new Range(startPos, endPos);
            const color = hexToVsCodeColor(colorString); 
            return new ColorInformation(range, color);
        });
    }

	public provideDocumentColors(document: TextDocument) {
		const matches = ColorProvider.parseDocument(document.getText());
		return matches;
	}
	public provideColorPresentations(color: Color) {
		const numberPresentation = vsCodeColorToHex(color);
		return [new ColorPresentation(numberPresentation)];
	}
}
