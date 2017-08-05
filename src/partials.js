const hbs = require("handlebars");
const fs = require("fs");
const path = require("path");

function regPartial(filePath){
    if (!fs.statSync(filePath).isFile()) {
        return console.warn(`Partial ${filePath} not found.`);
    }

    let partialContent = fs.readFileSync(filePath, "utf8");

    hbs.registerPartial(path.parse(filePath).name, partialContent);
}

function loadPartials(dir){
    fs.readdirSync(dir)
    .filter((file) => {
        return path.extname(file) === ".hbs";
    })
    .forEach((file) => {
        regPartial(dir + file);
    });
}

module.exports = {
    regPartial: regPartial,
    loadPartials: loadPartials
};