/**
 * Contains functions to convert WWDIY graphics into something that can be drawn to a canvas
 */

const INVALID_COLOR = [251, 72, 196];
/**
 * Generates Block-based ImageData based on binary data
 * @param {Uint8Array} binary binary data
 * @param {Array<Array>} palette palette data
 * @param {Number} sx Size X in pixels
 * @param {Number} sy Size y in pixels
 */
export function generateBitmapBlocksFromPalette(binary, palette, sx, sy) {
    const image = new ImageData(sx, sy);

    const bx = Math.floor(sx / 8);

    let x = 0, y = 0, v = 0, w = 0, b = 0; // inner position (x, y), outer block position (v, w), b = block index
    // Note: each block is 32 bytes long
    for (let i = 0; i < binary.length; i++) {
        // image data is UInt8 array of sx * sy * 4 (r, g, b, a)
        // WWDIY data is a 4-bit palette

        // calculate inner coordinates
        x = (i) % 4;
        y = Math.floor((i % 32) / 4);

        b = Math.floor((i) / 32);

        // calculate outer (block) coordinates
        v = b % bx;
        w = Math.floor(b / bx);

        const innerIndex = (x * 2) + (y * sx);
        const outerIndex = ((v * 8) + (w * bx * 8 * 8));
        const start = (innerIndex + outerIndex) * 4;
        const low = binary[i] & 15;
        const high = (binary[i] & 240) >> 4;

        // Draw low bits
        const arrLow = palette[low];
        if (arrLow) {
            image.data[start + 0] = arrLow[0];
            image.data[start + 1] = arrLow[1];
            image.data[start + 2] = arrLow[2];
            image.data[start + 3] = 255;
        } else {
            image.data[start + 0] = INVALID_COLOR[0];
            image.data[start + 1] = INVALID_COLOR[1];
            image.data[start + 2] = INVALID_COLOR[2];
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
            image.data[start + 4] = INVALID_COLOR[0];
            image.data[start + 5] = INVALID_COLOR[1];
            image.data[start + 6] = INVALID_COLOR[2];
            image.data[start + 7] = 255;
        }
    }

    return image;
}

/**
 * Generates Linear ImageData based on binary data
 * @param {Uint8Array} binary binary data
 * @param {Array<Array>} palette palette data
 * @param {Number} sx Size X in pixels
 * @param {Number} sy Size y in pixels
 */
function generateBitmapFromPalette(binary, palette, sx, sy) {
    const image = new ImageData(sx, sy);

    for (let i = 0; i < binary.length && i < sx * sy; i++) {
        // image data is UInt8 array of sx * sy * 4 (r, g, b, a)
        // WWDIY data is a 4-bit palette
        const start = i * 8;
        const low = binary[i] & 15;
        const high = (binary[i] & 240) >> 4;
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