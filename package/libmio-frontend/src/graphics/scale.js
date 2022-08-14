/**
 * Contains functions to help with scaling imageData
 */

export function scaleImageDataByInteger(imageData, scale) {
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

        scaledImageData.data[i * 4] = imageData.data[((origRow * origWidth) + origCol) * 4];
        scaledImageData.data[i * 4 + 1] = imageData.data[(((origRow * origWidth) + origCol) * 4) + 1];
        scaledImageData.data[i * 4 + 2] = imageData.data[(((origRow * origWidth) + origCol) * 4) + 2];
        scaledImageData.data[i * 4 + 3] = imageData.data[(((origRow * origWidth) + origCol) * 4) + 3];
    }

    return scaledImageData;
}