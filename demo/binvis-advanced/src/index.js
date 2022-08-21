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
const posBlock = document.getElementById('pos_block');
const posByte = document.getElementById('pos_byte');
const backPageButton = document.getElementById('page_back');
const nextPageButton = document.getElementById('page_next');
const pageIndex = document.getElementById('page_index');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let wholeFileBinary = null;
let canvasScale = 1;
let activeTableCellIndex = -1;
let activeTableCellType = "";
let tableStartPos = 0;
let tableEndPos = 32;

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

function processMioFile(uint8arr) {
    wholeFileBinary = uint8arr;
    readMioIntoCanvas(uint8arr);
    setTableValues(uint8arr.slice(0, 32), 4, 0, 32);
    movePage(0);
}

async function loadMioFile(event) {
    if (event.target && event.target.files && event.target.files[0]) {
        const arr = await event.target.files[0].arrayBuffer();
        const uint8arr = new Uint8Array(arr);
        processMioFile(uint8arr);
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
    const frag = document.createDocumentFragment();

    // Set Title
    const title = document.createElement('caption');
    title.textContent = `Hex data from 0x${start.toString(16).padStart(4, '0')} (${start}) to 0x${end.toString(16).padStart(4, '0')} (${end}): size ${mioPart.length} bytes`;

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
        hexData.textContent = mioPart[i].toString(16).padStart(2, '0');
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
    tableStartPos = start;
    tableEndPos = end;
}

function handleTableHover(event) {
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

function _getBytesPositionFromCoords(x, y, scale, numCols, begin) {
    const col = Math.floor(x / scale / 8);
    const row = Math.floor(y / scale / 8);

    const offset = (col * 32) + (row * 32 * numCols) + begin;

    const toRet = {
        col, row, offset
    };

    return toRet;
}

function handleCanvasClick(event) {
    // const col = Math.floor(event.offsetX / canvasScale / 8);
    // const row = Math.floor(event.offsetY / canvasScale / 8);

    const numCols = Math.floor(Number(bitmapWidthInput.value) / 8);
    const begin = Number(binStartInput.value);
    
    // const offset = (col * 32) + (row * 32 * numCols) + begin;

    const {offset} = _getBytesPositionFromCoords(event.offsetX, event.offsetY, canvasScale, numCols, begin);

    clearTable();

    setTableValues(wholeFileBinary.slice(offset, offset + 32), 4, offset, offset + 32);
}

function handleCanvasHover(event) {
    const numCols = Math.floor(Number(bitmapWidthInput.value) / 8);
    const begin = Number(binStartInput.value);

    const {col, row, offset} = _getBytesPositionFromCoords(event.offsetX, event.offsetY, canvasScale, numCols, begin);

    posBlock.textContent = `col: ${col}, row: ${row}`;
    posByte.textContent = `start: 0x${offset.toString(16).padStart(4, '0')} (${offset}), end: 0x${(offset + 32).toString(16).padStart(4, '0')} (${offset + 32})`;
}

function movePage(amount) {
    // each block is 4x8 bytes, with each 8 bytes being split into high and low values
    const pageSize = (Number(bitmapWidthInput.value) / 2) * Number(bitmapHeightInput.value);
    const curr = Number(binStartInput.value);

    let newPos = curr + (pageSize * amount);

    if (newPos > wholeFileBinary.length) {
        newPos = wholeFileBinary.length - pageSize;
    } else if (newPos < 0) {
        newPos = 0;
    }

    binStartInput.value = newPos;

    console.log("max",newPos, wholeFileBinary.length - pageSize);

    if (newPos >= wholeFileBinary.length - pageSize) {
        nextPageButton.setAttribute("disabled", "");
    } else {
        nextPageButton.removeAttribute("disabled");
    }

    if (newPos <= 0) {
        backPageButton.setAttribute("disabled", "");
    } else {
        backPageButton.removeAttribute("disabled");
    }

    const numPages = Math.floor(wholeFileBinary.length / pageSize);

    pageIndex.textContent = `Page ${Math.floor(newPos / pageSize) + 1} of ${numPages}. File size: ${wholeFileBinary.length}`;

    if (amount) {
        setTimeout(() => refreshCanvas());
    }
}

async function parseQueryParams() {
    const params = new URLSearchParams(location.search);

    // if (params.has('url')) {
    //     const url = decodeURIComponent(params.get('url'));
    //     console.log("Downloading from URL", url);
    //     // Download game from URL
    //     const response = await fetch(url, {
    //         redirect: 'follow',
    //         referrerPolicy: "no-referrer",
    //         mode: 'no-cors',
    //         credentials: 'omit'
    //     });

    //     if (response.ok) {
    //         console.log("Reading binary file...");
    //         const arr = await response.arrayBuffer();
    //         wholeFileBinary = new Uint8Array(arr);
    //     } else {
    //         console.warn('response not ok', response);
    //     }
    // }

    if (params.has('bin_start')) {
        binStartInput.value = params.get('bin_start');
    }
    if (params.has('bin_range')) {
        binRangeInput.value = params.get('bin_range');
    }
    if (params.has('scale')) {
        scaleInput.value = params.get('scale');
    }
    if (params.has('canvas_width')) {
        canvasWidthInput.value = params.get('canvas_width');
    }
    if (params.has('canvas_height')) {
        canvasHeightInput.value = params.get('canvas_height');
    }
    if (params.has('bitmap_width')) {
        bitmapWidthInput.value = params.get('bitmap_width');
    }
    if (params.has('bitmap_height')) {
        bitmapHeightInput.value = params.get('bitmap_height');
    }

    // refreshCanvas(null);
}

function main() {
    initializeCanvas(1024, 1024);
    fileInput.addEventListener('change', loadMioFile);
    refreshCanvasButton.addEventListener('click', refreshCanvas);
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasHover);
    blockTable.addEventListener('mouseover', handleTableHover);
    blockTable.addEventListener('mouseleave', handleTableHover);
    backPageButton.addEventListener('click', (e) => movePage(-1));
    nextPageButton.addEventListener('click', (e) => movePage(1));

    // Check for Query Params
    if (location.search) {
        parseQueryParams();
    }
}

main();