/**
 * Contains functions to help with scaling imageData
 */

export const DEFAULT_GRID_COLOR = [0, 255, 0, 0];

export function scaleImageDataByInteger(imageData, scale, {enableGrid = false, gridColor = DEFAULT_GRID_COLOR, gridFactor = 1} = {}) {
    const width = Math.floor(imageData.width * scale);
    const height = Math.floor(imageData.height * scale);
    const scaledImageData = new ImageData(width, height);

    const origWidth = imageData.width;
    const origHeight = imageData.height;

    const scaledBinLen = scaledImageData.data.length / 4;

    for (let i = 0; i < scaledBinLen; i++) {
        const row = Math.floor(i / width);
        const col = i % width;

        const origRow = Math.floor(row / scale);
        const origCol = Math.floor(col / scale);

        if (enableGrid && gridColor?.length && ((row % scale === 0 && origRow % gridFactor === 0) || (col % scale === 0 && origCol % gridFactor === 0))) {
            scaledImageData.data[i * 4] = gridColor[0];
            scaledImageData.data[i * 4 + 1] = gridColor[1];
            scaledImageData.data[i * 4 + 2] = gridColor[2];
            scaledImageData.data[i * 4 + 3] = gridColor[3];
        } else {
            scaledImageData.data[i * 4] = imageData.data[((origRow * origWidth) + origCol) * 4];
            scaledImageData.data[i * 4 + 1] = imageData.data[(((origRow * origWidth) + origCol) * 4) + 1];
            scaledImageData.data[i * 4 + 2] = imageData.data[(((origRow * origWidth) + origCol) * 4) + 2];
            scaledImageData.data[i * 4 + 3] = imageData.data[(((origRow * origWidth) + origCol) * 4) + 3];
        }
    }

    return scaledImageData;
}