"use strict";

const path = require("path");
const settings = require("./settings");

function getSlug(title){
    return title.replace(/[^a-z0-9]+/ig, " ")
            .trim().replace(/[^a-z0-9]/ig, "-")
            .toLowerCase();
}

function getUrlPath(filePath, fileName, pageAttributes){
        
    // if attributes have a permalink defined
    if ("permalink" in pageAttributes){
        let plink = path.parse(pageAttributes.permalink);

        if (plink.ext){
            return {
                path: plink.dir + "/",
                fileName: plink.name + plink.ext,
                permalink: "/" + plink.dir + "/" + plink.name + plink.ext
            };
        } else {
            return {
                path: plink.dir + "/" + plink.name + "/",
                fileName: "index.html",
                permalink: "/" + plink.dir + "/" + plink.name + "/"
            };
        }
    }
    
    // if it's a post
    if (("type" in pageAttributes && pageAttributes.type == "post")){
        let postPathDate = "";

        if (settings.getSetting("useDateInPostUrls")){
            postPathDate = pageAttributes.postDate.getFullYear() + "/"; 
            postPathDate += (pageAttributes.postDate.getMonth() + 1) + "/";
        }

        if (settings.getSetting("removeFileExtFromUrls")){
            return {
                path: postPathDate + getSlug(pageAttributes.title) + "/",
                fileName: "index.html",
                permalink: "/" + postPathDate + getSlug(pageAttributes.title) + "/"
            }
        } else {
            return {
                path: postPathDate,
                fileName: getSlug(pageAttributes.title) + ".html",
                permalink: "/" + postPathDate + getSlug(pageAttributes.title) + ".html"
            }
        }
    }

    // no permalink, and isn't a post
    if (settings.getSetting("removeFileExtFromUrls")){
        return {
            path: filePath + "/" + path.parse(fileName).name + "/",
            fileName: "index.html",
            permalink: "/" + filePath + "/" + path.parse(fileName).name + "/"
        }
    } else {
        return {
            path: filePath,
            fileName: path.parse(fileName).name + ".html",
            permalink: "/" + filePath + "/" + path.parse(fileName).name + ".html"
        }
    }

}

module.exports = {
    getSlug: getSlug,
    getUrlPath: getUrlPath
};