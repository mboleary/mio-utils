/**
 * Contains the mio file, is generic
 */

import { readInt, readString, writeInt, writeString } from "./binaryHelpers.js";
import MioContainer from "./MioContainer.js";

export default class MioContainer {
    constructor({binary, index}) {
        super({binary, index});
    }

    get command() {
        return readString(this.binary, 58845, 58857);
    }

    set command(val) {
        writeString(this.binary, val, 58845, 58857);
    }

    get length() {
        return this.binary[58885];
    }

    set length(val) {
        this.binary[58885] = val;
    }

    get cartType() {
        return this.binary[166];
    }

    set cartType(val) {
        this.binary[166] = val;
    }

    get cartColor() {
        return readString(this.binary, 168);
    }

    set cartColor(val) {
        writeString(this.binary, val, 168);
    }

    get logo() {
        return readString(this.binary, 167);
    }

    set logo(val) {
        writeString(this.binary, val, 167);
    }

    get logoColor() {
        return readString(this.binary, 169);
    }

    set logoColor(val) {
        writeString(this.binary, val, 169);
    }
}