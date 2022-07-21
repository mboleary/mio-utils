/**
 * Contains functions to convert WWDIY graphics into something that can be drawn to a canvas
 */

export function generateBitmapFromPalette(binary, palette, sx, sy) {
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