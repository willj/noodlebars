"use strict";

const hbs = require("handlebars");
const md = require("markdown-it")({ html: true });

function renderPage(template, body, model) {

    hbs.registerPartial("body-content", body);

    return hbs.compile(template)(model);
}

function markdownToHtml(content) {
    return md.render(content);
}

module.exports = {
    renderPage: renderPage,
    markdownToHtml: markdownToHtml
};