"use strict";

const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
let settings;

function createDir(path) {

    let createdPath = "";

    path.split("/").forEach((dir) => {
        if (dir == "." || dir == "") {
            return;
        }
        
        try {
            fs.mkdirSync(createdPath + dir);
        } catch (error) { }

        createdPath += dir + "/";
    });
}

function removeDir(path) {
    rimraf.sync(path);
}

function copyFile(from, to) {
    fs.createReadStream(from).pipe(fs.createWriteStream(to));
}

function writeFile(file, data) {
    fs.writeFile(file, data, (err) => {
        if (err) return console.error(err);
    });
}

module.exports = function(appSettings){
    settings = appSettings;
    return {
        copyFile: copyFile,
        createDir: createDir,
        removeDir: removeDir,
        writeFile: writeFile
    };
};