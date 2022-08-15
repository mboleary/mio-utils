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
const blockTable = document.getElementById('block_table');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let wholeFileBinary = null;
let canvasScale = 1;
let activeTableCellIndex = -1;
let activeTableCellType = "";

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
    canvasScale = scale;
}

async function loadMioFile(event) {
    if (event.target && event.target.files && event.target.files[0]) {
        const arr = await event.target.files[0].arrayBuffer();
        const uint8arr = new Uint8Array(arr);
        wholeFileBinary = uint8arr;
        console.log(wholeFileBinary);
        readMioIntoCanvas(uint8arr);
        setTableValues(uint8arr.slice(0, 32), 4, 0, 32);
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
    if (begin >= 0 && range > 0 && begin + range <= wholeFileBinary.length) {
        part = wholeFileBinary.slice(begin, begin + range)
    } else if (begin > 0 && range === -1) {
        part = wholeFileBinary.slice(begin)
    } else {
        part = wholeFileBinary;
    }
    readMioIntoCanvas(part, Number(bitmapWidthInput.value), Number(bitmapHeightInput.value), Number(scaleInput.value), enableGridInput.checked);
}

function clearTable() {
    // Delete any items still in table from previous generations
    while (blockTable.firstChild) {
        blockTable.removeChild(blockTable.firstChild);
    }
}

function setTableValues(mioPart, cols = 4, start, end) {
    console.log("part", mioPart, cols);
    const frag = document.createDocumentFragment();

    // Set Title
    const title = document.createElement('caption');
    title.textContent = `Hex data from 0x${start.toString(16)} (${start}) to 0x${end.toString(16)} (${end}): size ${mioPart.length} bytes`;

    frag.appendChild(title);

    // Build table from passed-in data
    let hexFrag = document.createDocumentFragment();
    let asciiFrag = document.createDocumentFragment();
    let currRow = document.createElement('tr');
    for (let i = 0; i < mioPart.length; i++) {
        if (i % cols === 0 && hexFrag.childElementCount > 0) {
            currRow.appendChild(hexFrag);
            currRow.appendChild(asciiFrag);
            frag.appendChild(currRow);
            currRow = document.createElement('tr');
        }

        const hexData = document.createElement('td');
        hexData.textContent = mioPart[i].toString(16);
        hexData.setAttribute('index', i);
        hexData.setAttribute('data_type', "hex");

        const asciiData = document.createElement('td');
        asciiData.textContent = String.fromCharCode(mioPart[i]);
        asciiData.setAttribute('index', i);
        asciiData.setAttribute('data_type', "ascii");

        hexFrag.appendChild(hexData);
        asciiFrag.appendChild(asciiData);
    }

    blockTable.appendChild(frag);
}

function handleTableHover(event) {
    console.log("target", event.target);
    const type = event.target.getAttribute('data_type');
    const index = parseInt(event.target.getAttribute('index'));
    if (event.type === 'mouseleave') {
        activeTableCellIndex = -1;
        const arr = blockTable.querySelectorAll('td.selected');
        for (const el of arr) {
            el.classList.remove('selected')
        }
    } else if (type) {
        const oldEl = blockTable.querySelector(`td[index="${activeTableCellIndex}"][data_type="${activeTableCellType === "hex" ? "ascii" : "hex"}"]`);
        activeTableCellIndex = index;
        activeTableCellType = type;
        const el = blockTable.querySelector(`td[index="${index}"][data_type="${type === "hex" ? "ascii" : "hex"}"]`);
        if (el) {
            el.classList.add('selected');
        }
        if (oldEl) {
            oldEl.classList.remove('selected');
        }
    }
}

function handleCanvasClick(event) {
    const col = Math.floor(event.offsetX / canvasScale / 8);
    const row = Math.floor(event.offsetY / canvasScale / 8);

    const numCols = Math.floor(Number(bitmapWidthInput.value) / 8);
    const begin = Number(binStartInput.value);
    
    const offset = (col * 32) + (row * 32 * numCols) + begin;
    
    console.log("click", event.offsetX, event.offsetY, col, row, offset);

    clearTable();

    setTableValues(wholeFileBinary.slice(offset, offset + 32), 4, offset, offset + 32);
}

function main() {
    initializeCanvas(1024, 1024);
    fileInput.addEventListener('change', loadMioFile);
    refreshCanvasButton.addEventListener('click', refreshCanvas);
    canvas.addEventListener('click', handleCanvasClick);
    blockTable.addEventListener('mouseover', handleTableHover);
    blockTable.addEventListener('mouseleave', handleTableHover);
}

main();