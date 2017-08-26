"use strict";

const settings = require("./settings");
const url = require("./urls")(settings);
const posts = require("./posts")(settings);
const files = require("./files");
const templates = require("./templates");
const renderer = require("./renderer");
const partials = require("./partials");
const fs = require("fs");
const path = require("path");
const fm = require("front-matter");

function init(userSettings){
    settings.init(userSettings);

    partials.loadPartials(settings.getSetting("partialsDir"));
    templates.loadTemplates(settings.getSetting("templateDir"));
}

function run(){
    if (settings.getSetting("removeOutputDir")){
        files.removeDir(settings.getSetting("outputDir"));
    }

    files.createDir(settings.getSetting("outputDir"));

    processDirectory(settings.getSetting("sourceDir"), "");

    posts.generatePostPages();
}

function processDirectory(sourceRoot, currentPath){
    fs.readdirSync(sourceRoot + currentPath).forEach((file) => {
        let fileInfo = fs.statSync(sourceRoot + currentPath + file);

        if (fileInfo.isDirectory()){
            files.createDir(settings.getSetting("outputDir") + currentPath + file);
            processDirectory(sourceRoot, currentPath + file + "/");
        } else if (path.extname(file) === ".md") {
            processPage(currentPath, file);
        } else {
            fs.createReadStream(sourceRoot + currentPath + file)
            .pipe(fs.createWriteStream(settings.getSetting("outputDir") + currentPath + file));
        }
    });
}

function processPage(filePath, fileName){
    let docSourcePath = settings.getSetting("sourceDir") + filePath + fileName;
    let doc = fm(fs.readFileSync(docSourcePath, "utf8"));

    if (isInPostsDirectory(filePath)){
        doc.attributes.type = "post";
        doc.attributes.postDate = posts.getPostDate(doc.date);
    }

    let model = settings.getAllSettings();
    model.doc = doc.attributes;
    model.fileSource = docSourcePath;
    model.fileDestination = url.getUrlPath(filePath, fileName, doc.attributes);

    let templateName = templates.getTemplateNameForPage(filePath + fileName, doc.attributes);  

    if (templateName == undefined) return;

    if ("type" in model.doc && model.doc.type == "post"){
        if (!doc.attributes.excerpt && !doc.attributes.excerptHtml){
            
            let firstParagraph = doc.body.split("\r\n").find((line) => {
                return /^[a-zA-Z0-9]+/.test(line);
            });

            doc.attributes.excerpt = firstParagraph;
        }

        posts.indexPost(model);
    }

    let html = renderer.renderPage(templates.getTemplate(templateName), renderer.markdownToHtml(doc.body), model);

    if (model.fileDestination.path){
        files.createDir(settings.getSetting("outputDir") + model.fileDestination.path);
    }

    files.writeFile(settings.getSetting("outputDir") + model.fileDestination.path + model.fileDestination.fileName, html);
}

function isInPostsDirectory(dir){
    return (dir.indexOf(settings.getSetting("postsDir").replace(/^\.\//, "")) === 0);
}

module.exports = function(userSettings) {
    console.log("This is Noodle!");

    init(userSettings);

    run();
}