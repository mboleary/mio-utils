/**
 * Binary Visualization demo
 */

import { PaletteEnum } from "libmio";
import {generateBitmapBlocksFromPalette, scaleImageDataByInteger} from "libmio-frontend";

const fileInput = document.getElementById('file_input');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

async function loadMioFile(event) {
    if (event.target && event.target.files && event.target.files[0]) {
        const arr = await event.target.files[0].arrayBuffer();
        const uint8arr = new Uint8Array(arr);
        console.log(uint8arr);
        let img = generateBitmapBlocksFromPalette(uint8arr, PaletteEnum, 256, 256);
        img = scaleImageDataByInteger(img, 4);
        context.putImageData(img, 0, 0);
        context.scale(4, 4);
    }
}

function main() {
    fileInput.addEventListener('change', loadMioFile);
}

main();