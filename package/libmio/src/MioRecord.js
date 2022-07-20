/**
 * Has additional properties for Records
 */

import { readInt, readString, writeInt, writeString } from "./binaryHelpers.js";
import MioContainer from "./MioContainer.js";

export default class MioRecord extends MioContainer {
    constructor({binary, index}) {
        super({binary, index});
    }

    get tempo() {
        return (readInt(this.binary, 257, 258) * 10) + 60;
        // return (this.binary[257] * 10) + 60;
    }
    set tempo(val) {
        // this.binary[257] = Math.floor((val - 60) / 10);
        writeInt(this.binary, Math.floor((val - 60) / 10), 257, 258);
    }

    get swing() {
        return this.binary[256] === 1;
    }
    set swing(val) {
        this.binary[256] = val ? 1 : 0;
    }

    get flag() {
        return readInt(this.binary, 258, 259);
    }
    set flag(val) {
        writeInt(this.binary, val, 258, 259);
    }

    get recordType() {
        return readInt(this.binary, 166, 167);
    }
    set recordType(val) {
        writeInt(this.binary, val, 166, 167);
    }

    get recordColor() {
        return readInt(this.binary, 168, 169);
    }
    set recordColor(val) {
        writeInt(this.binary,val, 168, 169);
    }

    get logo() {
        return readInt(this.binary, 167, 168);
    }
    set logo(val) {
        writeInt(this.binary, val, 167, 168);
    }

    get logoColor() {
        return readInt(this.binary, 169, 170);
    }
    set logoColor(val) {
        writeInt(this.binary, val, 169, 170);
    }


}