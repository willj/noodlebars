"use strict";

const path = require("path");
const templates = require("./templates");
const files = require("./files");
const renderer = require("./renderer");

let posts = {};
let postCount = 0;
let totalPostPages = 0;
let settings;

function getPostDate(date){
    let d = new Date(date);
    
    // if no date, or an invalid date, we'll go with this
    if (isNaN(d.getFullYear()) || isNaN(d.getMonth())){
        d = new Date("1970/01/01");
    }

    return d;
}

function indexPost(post){
    let d = getPostDate(post.doc.date);

    // postCount ensures all posts have a unique key when getTime() is the same
    posts["p-" + d.getTime() + "-" + postCount] = {
        fileSource: post.fileSource,
        fileDestination: post.fileDestination,
        attributes: post.doc,
        postDate: d
    };
    
    postCount += 1;
}

function getPosts(){
    return Object.assign({}, posts);
}

function getPostPagePath(){

    if(settings.getSetting("postsPermalink")){
        var pp = path.parse(settings.getSetting("postsPermalink"));    
    } else {
        var pp = path.parse("index.html");
    }

    if (pp.ext && pp.dir){
        return {
            path: pp.dir + "/",
            fileName: pp.name + pp.ext
        };
    }

    if (pp.ext && !pp.dir){
        return {
            path: "",
            fileName: pp.name + pp.ext
        };
    }

    if (!pp.ext && !pp.dir){
        return {
            path: pp.name + "/",
            fileName: "index.html"
        };
    }

    if (!pp.ext && pp.dir){
        return {
            path: pp.dir + "/" + pp.name + "/",
            fileName: "index.html"
        };
    }
}

function generatePagingLinks(pageNum, totalPages, postPath){
    let paging = {
        currentPageNum: pageNum,
        totalPages: totalPages
    };

    if (pageNum == 1){
        paging.previous = null;
    } else if (pageNum == 2) {
        paging.previous = "/" + postPath.path + postPath.fileName;
    } else {
        paging.previous = "/" + postPath.path + settings.getSetting("postsPagingPath") + "/" + (pageNum - 1);
    }

    if (pageNum == totalPages){
        paging.next = null;
    } else {
        paging.next = "/" + postPath.path + settings.getSetting("postsPagingPath") + "/" + (pageNum + 1);
    }

    return paging;
}

function generatePostPages(){
    let postPath = getPostPagePath();
    let postsPerPage = settings.getSetting("postsPerPage");

    let pageOfPosts = [];
    let pageNum = 1;
    totalPostPages = Math.ceil(postCount / postsPerPage);

    sortPostsByDateDescending(posts).forEach((post) => {
        pageOfPosts.push(posts[post]);

        if (pageOfPosts.length >= postsPerPage){
            generatePostPage(pageOfPosts, pageNum, postPath);
            pageOfPosts = [];
            pageNum += 1;
        }
    });

    // generate the last page of posts
    if (pageOfPosts.length > 0){
        generatePostPage(pageOfPosts, pageNum, postPath);
    }
}

function sortPostsByDateDescending(posts){
    return Object.keys(posts).sort((a,b) => {
        // sort numerically after discarding prefix "p-" and postfix "-postCount"
        a = a.split("-");
        b = b.split("-");
        return b[1] - a[1];
    });
}

function generatePostPage(posts, pageNum, postPath){
    let model = settings.getAllSettings();
    model.doc = null;   // something seems to be holding on to the last processed page model
    model.pageNum = pageNum;
    model.posts = posts;
    model.paging = generatePagingLinks(pageNum, totalPostPages, postPath);

    let templateName = templates.getTemplateNameForPage(settings.getSetting("postsPermalink"), {type: "posts"});  

    let html = renderer.renderPage(templates.getTemplate(templateName), "", model);

    let fileDestination = settings.getSetting("outputDir") + postPath.path;

    files.createDir(fileDestination);

    if (pageNum == 1){
        fileDestination = fileDestination + postPath.fileName;
    } else {
        fileDestination = fileDestination + settings.getSetting("postsPagingPath") + "/" + pageNum;
        files.createDir(fileDestination);
        fileDestination = fileDestination + "/index.html";
    }

    files.writeFile(fileDestination, html);
}

module.exports = function(appSettings){
    settings = appSettings;

    return {
        getPostDate: getPostDate,
        indexPost: indexPost,
        getPostPagePath: getPostPagePath,
        getPosts: getPosts,
        generatePagingLinks: generatePagingLinks,
        generatePostPages: generatePostPages
    };
}
