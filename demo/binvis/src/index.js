/**
 * Binary Visualization demo
 */

import { PaletteEnum } from "libmio";
import {generateBitmapBlocksFromPalette, scaleImageDataByInteger} from "libmio-frontend";

const fileInput = document.getElementById('file_input');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

function initializeCanvas(width, height) {
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    context.imageSmoothingEnabled = false;
}

function readMioIntoCanvas(mioPart) {
    let img = generateBitmapBlocksFromPalette(mioPart, PaletteEnum, 256, 256);
    img = scaleImageDataByInteger(img, 4, {enableGrid: true, gridFactor: 8});
    context.putImageData(img, 0, 0);
}

async function loadMioFile(event) {
    if (event.target && event.target.files && event.target.files[0]) {
        const arr = await event.target.files[0].arrayBuffer();
        const uint8arr = new Uint8Array(arr);
        readMioIntoCanvas(uint8arr);
    }
}

function main() {
    initializeCanvas(1024, 1024);
    fileInput.addEventListener('change', loadMioFile);
}

main();