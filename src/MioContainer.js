/**
 * Contains the mio file, is generic
 */

import { readInt, readString, writeInt, writeString } from "./binaryHelpers";

export default class MioContainer {
    constructor({binary, index}) {
        this.binary = binary;
        this.index = index;
    }

    get name() {
        return readString(this.binary, 28, 40);
    }

    set name(val) {
        writeString(this.binary, val, 28, 40);
    }


    get description() {
        return readString(this.binary, 91, 127);
    }

    set description(val) {
        writeString(this.binary, val, 91, 127);
    }

    get brand() {
        return readString(this.binary, 53, 62);
    }

    set brand(val) {
        writeString(this.binary, val, 53, 62);
    }

    get creator() {
        return readString(this.binary, 72, 81);
    }

    set creator(val) {
        writeString(this.binary, val, 72, 81);
    }

    get serial() {
        // Serial number typically looks something like `G-ROFL-0158-000`, but the `g-` is not stored
        const toRet = [];
        toRet.push(readString(this.binary, 207, 211)); // String part of serial number
        toRet.push(readInt(this.binary, 212, 216) + 1); // Middle numerical part
        toRet.push(readInt(this.binary, 216, 218)); // Last numerical part

        return toRet;
    }

    set serial(val) {
        writeString(this.binary, val[0], 207, 211);
        writeInt(this.binary, val[1] - 1, 212, 216);
        writeInt(this.binary, val[2], 216, 218);
    }

    get locked() {
        return this.binary[232] !== 0;
    }

    set locked(val) {
        this.binary[232] = val ? 5 : 0;
    }
}