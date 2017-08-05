"use strict";

const defaultSettings = {
    siteTitle: "A Noodle site",
    outputDir: "./docs/", 
    sourceDir: "./site/",
    templateDir: "./templates/",
    partialsDir: "./templates/partials/",
    postsDir: "./posts/",
    removeOutputDir: true,
    removeFileExtFromUrls: true,
    useDateInPostUrls: true,
    postsPerPage: 10,
    postsPermalink: "index.html",
    postsPagingPath: "page"
};

var settings = defaultSettings;

function init(userSettings){
    settings = Object.assign({}, defaultSettings, userSettings);
}

function getSetting(name){
    return settings[name];
}

function addSetting(name, value){
    settings[name] = value;
}

module.exports = {
    init: init,
    getSetting: getSetting,
    addSetting: addSetting
};