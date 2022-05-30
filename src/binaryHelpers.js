/**
 * Helper functions for reading and writing binary data
 */

export function readString(binary, start, stop) {
    // Uses 0 as a stopping value
    let arr =  binary.slice(start, stop);
    let toRet = "";
    for (const byte of arr) {
        if (byte === 0x0) {
            break;
        }
        toRet += String.fromCharCode(byte);
    }
    return toRet;
}

export function writeString(binary, value, start, stop) {
    for (let i = start; i < stop; i++) {
        if (i - start < value.length) {
            binary[i] = value.charCodeAt(i) & 127; // Only want the 8 ascii bits
        } else {
            binary[i] = 0x0;
        }
    }
}

export function readInt(binary, start, end) {
    if (end - start > 1) {
        // involves more than one UInt8 value
        let toRet = 0;
        for (let i = start; i < end; i++) {
            toRet += (binary[i] << (i * 8));
        }
        return toRet;
    } else {
        return binary[start];
    }
}

export function writeInt(binary, value, start, end) {
    if (end - start > 1) {
        // involves more than one UInt8 value
        for (let i = start; i < end; i++) {
            binary[i] = (value >> (i * 8)) & 127;
        }
    } else {
        binary[start] = value & 127;
    }
}