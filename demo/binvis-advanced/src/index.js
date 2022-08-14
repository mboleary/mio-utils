/**
 * Binary Visualization demo
 */

import { PaletteEnum } from "libmio";
import {generateBitmapBlocksFromPalette, scaleImageDataByInteger} from "libmio-frontend";

const fileInput = document.getElementById('file_input');
const binStartInput = document.getElementById('bin_start');
const binRangeInput = document.getElementById('bin_range');
const scaleInput = document.getElementById('scale');
const canvasWidthInput = document.getElementById('canvas_width');
const canvasHeightInput = document.getElementById('canvas_height');
const bitmapWidthInput = document.getElementById('bitmap_width');
const bitmapHeightInput = document.getElementById('bitmap_height');
const refreshCanvasButton = document.getElementById('refresh_canvas');
const enableGridInput = document.getElementById('enable_grid');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let wholeFileBinary = null;

function initializeCanvas(width, height) {
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    context.imageSmoothingEnabled = false;
    canvasWidthInput.value = width;
    canvasHeightInput.value = height;
}

function readMioIntoCanvas(mioPart, bitmapWidth = 256, bitmapHeight = 256, scale = 4, enableGrid = true) {
    let img = generateBitmapBlocksFromPalette(mioPart, PaletteEnum, bitmapWidth, bitmapHeight);
    if (scale !== 1) {
        img = scaleImageDataByInteger(img, scale, {enableGrid, gridFactor: 8});
    }
    context.putImageData(img, 0, 0);
}

async function loadMioFile(event) {
    if (event.target && event.target.files && event.target.files[0]) {
        const arr = await event.target.files[0].arrayBuffer();
        const uint8arr = new Uint8Array(arr);
        wholeFileBinary = uint8arr;
        console.log(wholeFileBinary);
        readMioIntoCanvas(uint8arr);
    }
}

/**
 * Redraw the picture in the canvas
 * @param {*} event 
 */
function refreshCanvas(event) {
    if (!wholeFileBinary) return;
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    let part = null;
    const begin = Number(binStartInput.value);
    const range = Number(binRangeInput.value);
    console.log("refresh", begin, range);
    if (begin > 0 && range > 0 && begin + range <= wholeFileBinary.length) {
        part = wholeFileBinary.slice(begin, begin + range)
    } else if (begin > 0 && range === -1) {
        part = wholeFileBinary.slice(begin)
    } else {
        part = wholeFileBinary;
    }
    readMioIntoCanvas(part, Number(bitmapWidthInput.value), Number(bitmapHeightInput.value), Number(scaleInput.value), enableGridInput.checked);
}

function main() {
    initializeCanvas(1024, 1024);
    fileInput.addEventListener('change', loadMioFile);
    refreshCanvasButton.addEventListener('click', refreshCanvas);
}

main();