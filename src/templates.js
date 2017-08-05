"use strict";

const fs = require("fs");
const path = require("path");

const templates = {};

function addTemplate(name, value){
    if (hasTemplate(name)){
        throw new Error(`The template ${name} already exists`);
    }

    templates[name] = value;
}

function loadTemplatesFromDirectory(dir){
    fs.readdirSync(dir)
    .filter((file) => {
        return path.extname(file) === ".hbs";
    })
    .forEach((file) => {
        addTemplate(path.parse(file).name, fs.readFileSync(dir + file, "utf8"));
    }, this);
}

function getTemplate(name){
    if (hasTemplate(name)){
        return templates[name];
    } else {
        throw new Error(`The template ${name} does not exist`);
    }
}

function hasTemplate(name){
    return (name in templates);
}

function removeTemplates(){
    Object.keys(templates).forEach((t) => {
        removeTemplate(t);
    });
}

function removeTemplate(name){
    delete templates[name];
}

function getTemplateNameForPage(filePath, pageAttributes) {

    // if a template was specified, and it exists, use it
    if ("template" in pageAttributes){
        if (hasTemplate(pageAttributes.template)){
            return pageAttributes.template;
        } else {
            console.warn(`The template ${pageAttributes.template} specified by ${filePath} does not exist.`);
        }
    }

    // if a template name matches a filename, use that
    let fileName = path.parse(filePath).name;
    if (hasTemplate(fileName)){
        return fileName;
    }

    // if the type property (page|post|custom...) was specified and a template name matches, use that
    if ("type" in pageAttributes && hasTemplate(pageAttributes.type)){
        return pageAttributes.type;
    }

    // otherwise index should be default
    if (hasTemplate("index")){
        return "index";
    }

    throw new Error(`No matching template can be found for ${filePath}`);
}

module.exports = {
    addTemplate: addTemplate,
    getTemplate: getTemplate,
    getTemplateNameForPage: getTemplateNameForPage,
    hasTemplate: hasTemplate,
    loadTemplates: loadTemplatesFromDirectory,
    removeTemplate: removeTemplate,
    removeTemplates: removeTemplates
};
