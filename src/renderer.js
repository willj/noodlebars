"use strict";

const hbs = require("handlebars");

function renderPage(template, body, model) {

    hbs.registerPartial("body-content", body);

    return hbs.compile(template)(model);
}

module.exports = {
    renderPage: renderPage
};