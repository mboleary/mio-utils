/**
 * Has additional properties for Manga / Comics
 */

import { readInt, readString, writeInt, writeString } from "./binaryHelpers.js";
import MioContainer from "./MioContainer.js";

export default class MioManga extends MioContainer {
    constructor({binary, index}) {
        super({binary, index});
    }

    get color() {
        return readInt(this.binary, 168, 169);
    }
    set color(val) {
        writeInt(this.binary, val, 168, 169);
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