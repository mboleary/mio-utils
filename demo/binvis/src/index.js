/**
 * Binary Visualization demo
 */

import { PaletteEnum, MioGame } from "libmio";

const fileInput = document.getElementById('file_input');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// @TODO move this back to another util library
function generateBitmapFromPalette(binary, palette, sx, sy) {
    const image = new ImageData(sx, sy);

    for (let i = 0; i < binary.length && i < sx * sy; i++) {
        // image data is UInt8 array of sx * sy * 4 (r, g, b, a)
        const start = i * 4;
        const arr = palette[binary[i]];
        image.data[start + 0] = arr[0];
        image.data[start + 1] = arr[1];
        image.data[start + 2] = arr[2];
        image.data[start + 3] = 0;
    }

    return image;
}
// END

async function loadMioFile(blob) {
    // @TODO load the file
    const arr = await blob.arrayBuffer();
    const img = generateBitmapFromPalette(new Uint8Array(arr), PaletteEnum, 256, 256);
    context.putImageData(img);
}

function main() {
    fileInput.addEventListener('change', loadMioFile);
}

main();