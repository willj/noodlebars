"use strict";

const path = require("path");

function getSlug(title){
    return title.replace(/[^a-z0-9]+/ig, " ")
            .trim().replace(/[^a-z0-9]/ig, "-")
            .toLowerCase();
}



module.exports = {
    getSlug: getSlug
};