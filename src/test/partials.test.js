const assert = require("assert");
const partials = require("../partials");
const hbs = require("handlebars");

const testPartialDirectory = "./test/partials/";

describe("Partials", function(){
    
    describe("regPartials", function(){

        it("loads and registers a partial template file", function(){
            partials.regPartial(testPartialDirectory + "header.hbs");

            let output = hbs.compile("{{> header }}")();

            assert.equal(output, "<h1>This is my page header</h1>");
        });

    });

    describe("loadPartials", function(){

        it("loads and registers all hbs files in the partials dir", function(){

            partials.loadPartials(testPartialDirectory);

            let output = hbs.compile("{{> header }} {{> footer }}")();

            assert.equal(output, "<h1>This is my page header</h1> <footer>This is the footer.</footer>");
        });

        it ("does not load none hbs files", function(){

            partials.loadPartials(testPartialDirectory);

            assert.throws(() => hbs.compile("{{> something }}")());
        });

    });

});