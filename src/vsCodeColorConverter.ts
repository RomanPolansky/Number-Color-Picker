import { Color } from 'vscode';

const colorComponentToHex = (colorCompoment: number) => {
    const hex = colorCompoment.toString(16);
    if (hex.length === 1) {
        return "0" + hex;
    } else {
        return hex;
    }
};

/**
 * @param hexColor
 * - numeric color presentation in string format
 * @example
 * VsCodeColorConverter.hexToVsCodeColor('0xff0000')
 */
export const hexToVsCodeColor = (hexColor: string) => {
    const result = /^0x?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    return new Color(r, g, b, 1);
};

export const vsCodeColorToHex = (color: Color) => {
    return "0x" + colorComponentToHex(color.red * 255) + colorComponentToHex(color.green * 255) + colorComponentToHex(color.blue * 255);
};
