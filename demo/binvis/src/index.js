/**
 * Binary Visualization demo
 */

import { PaletteEnum } from "libmio";

const fileInput = document.getElementById('file_input');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

// @TODO move this back to another util library
function generateBitmapFromPalette(binary, palette, sx, sy) {
    const image = new ImageData(sx, sy);

    for (let i = 0; i < binary.length && i < sx * sy; i++) {
        // image data is UInt8 array of sx * sy * 4 (r, g, b, a)
        // WWDIY data is a 4-bit palette
        const start = i * 8;
        const low = binary[i] & 15;
        const high = (binary[1] & 240) >> 4;
        // Draw low bits
        const arrLow = palette[low];
        if (arrLow) {
            image.data[start + 0] = arrLow[0];
            image.data[start + 1] = arrLow[1];
            image.data[start + 2] = arrLow[2];
            image.data[start + 3] = 255;
        } else {
            image.data[start + 0] = 251;
            image.data[start + 1] = 72;
            image.data[start + 2] = 196;
            image.data[start + 3] = 255;
        }
        // Draw high bits
        const arrHigh = palette[high];
        if (arrHigh) {
            image.data[start + 4] = arrHigh[0];
            image.data[start + 5] = arrHigh[1];
            image.data[start + 6] = arrHigh[2];
            image.data[start + 7] = 255;
        } else {
            image.data[start + 4] = 251;
            image.data[start + 5] = 72;
            image.data[start + 6] = 196;
            image.data[start + 7] = 255;
        }
    }

    return image;
}
// END

async function loadMioFile(event) {
    console.log(event);
    // @TODO load the file
    if (event.target && event.target.files && event.target.files[0]) {
        const arr = await event.target.files[0].arrayBuffer();
        const img = generateBitmapFromPalette(new Uint8Array(arr), PaletteEnum, 256, 256);
        context.putImageData(img, 0, 0);
    }
}

function main() {
    fileInput.addEventListener('change', loadMioFile);
}

main();