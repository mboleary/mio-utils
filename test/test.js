import MioContainer from "../src/MioContainer.js";

import  fs from "fs";

console.log("hi");

try {
    const mioFile = fs.readFileSync("./mio/test_file.mio");
    let mio = new MioContainer({binary: mioFile});
    let s = mio.serial;
    console.log(mio.name, mio.description, mio.brand, mio.serial, mio.creator, mio.locked);
    s[1] = 4096;
    mio.serial = s;
    console.log(mio.serial);
} catch (err) {
    console.error(err);
}

