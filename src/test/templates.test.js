const assert = require("assert");
const templates = require("../templates");

const testTemplateDirectory = "./test/templates/";

describe("Templates", function(){

    beforeEach(function(){
        templates.removeTemplates();
    });

    it("Allows adding and removing of templates", function(){
        templates.addTemplate("index", "");
        assert.equal(true, templates.hasTemplate("index"));

        templates.removeTemplate("index");
        assert.equal(false, templates.hasTemplate("index"));
    });

    describe("removeTemplates", function(){

        it("removes all templates", function(){
            templates.addTemplate("index", "");
            templates.addTemplate("home", "");
            templates.addTemplate("about", "");

            templates.removeTemplates();

            assert.equal(templates.hasTemplate("index"), false);
            assert.equal(templates.hasTemplate("home"), false);
            assert.equal(templates.hasTemplate("about"), false);
        });
    });

    describe("hasTemplate", function(){

        it("returns false when the template doesn't exist", function(){
            templates.addTemplate("index", "");
            assert.equal(templates.hasTemplate("dummytemplatename"), false);
        });

        it("returns true when the template does exist", function(){
            templates.addTemplate("index", "");
            assert.equal(templates.hasTemplate("index"), true);
        });
    });

    describe("getTemplate", function(){
        
        it("throws an error when the template does not exist", function(){
            templates.addTemplate("index", "");
            assert.throws(() => templates.getTemplate("dummytemplatename"), "The template dummytemplatename does not exist");
        });

        it("returns the template when it exists", function(){
            let content = "the index template content"; 

            templates.addTemplate("index", content);
            let index = templates.getTemplate("index");

            assert.equal(index, content);
        });

    });

    describe("loadTemplates", function(){
        it("loads all templates from the specified directory", function(){
            templates.loadTemplates(testTemplateDirectory);
            
            assert.equal(templates.getTemplate("index"), "The index template");
            assert.equal(templates.getTemplate("about"), "The about template");
        });

        it("does not load none hbs files", function(){
            templates.loadTemplates(testTemplateDirectory);

            assert.equal(templates.hasTemplate("something"), false);
        });
    });

    describe("getTemplateNameForPage", function(){
        // type: "page", template: "custom"

        it("throws an error when no templates are available", function(){
            assert.throws(() => templates.getTemplateNameForPage("index.md", {}), "No matching template can be found for index.md");
        });

        it("returns the name of a template when it is specified in page attributes and exists", function(){
            templates.addTemplate("custom", "");
            let name = templates.getTemplateNameForPage("index.md", { template: "custom" });

            assert.equal(name, "custom");
        });

        it("does not return the specified template name when it doesn't exist", function(){
            templates.addTemplate("index", "");
            let name = templates.getTemplateNameForPage("index.md", { template: "custom" });

            assert.equal(name, "index");
        });

        it("returns a template name matching the filename if template not specified", function(){
            templates.addTemplate("about", "");
            let name = templates.getTemplateNameForPage("about.md", {});

            assert.equal(name, "about");
        });

        it("does not return a template name matching the filename if it doesn't exist", function(){
            templates.addTemplate("index", "");
            let name = templates.getTemplateNameForPage("about.md", {});

            assert.equal(name, "index");
        });

        it("returns the correct template for the page type", function(){
            templates.addTemplate("page", "");
            templates.addTemplate("post", "");

            let pageTemplate = templates.getTemplateNameForPage("a-page.md", { type: "page" });
            let postTemplate = templates.getTemplateNameForPage("a-post.md", { type: "post" });

            assert.equal(pageTemplate, "page");
            assert.equal(postTemplate, "post");
        });

        it("doesn't return a 'page' type template where it doesn't exist", function(){
            templates.addTemplate("post", "");
            templates.addTemplate("index", "");

            let pageTemplate = templates.getTemplateNameForPage("a-page.md", { type: "page" });

            assert.equal(pageTemplate, "index");
        });

        it("matches pageAttributes.template first", function(){
            templates.addTemplate("specified", "");
            templates.addTemplate("about", "");
            templates.addTemplate("page", "");
            templates.addTemplate("index", "");

            let templateName = templates.getTemplateNameForPage("about.md", { template: "specified", type: "page" });

            assert.equal(templateName, "specified");
        });

        it("matches page name second", function(){
            templates.addTemplate("about", "");
            templates.addTemplate("page", "");
            templates.addTemplate("index", "");

            let templateName = templates.getTemplateNameForPage("about.md", { template: "specified", type: "page" });

            assert.equal(templateName, "about");
        });

        it("matches page type third", function(){
            templates.addTemplate("page", "");
            templates.addTemplate("index", "");

            let templateName = templates.getTemplateNameForPage("about.md", { template: "specified", type: "page" });

            assert.equal(templateName, "page");
        });

        it("returns default when no others match", function(){
            templates.addTemplate("index", "");

            let templateName = templates.getTemplateNameForPage("about.md", { template: "specified", type: "page" });

            assert.equal(templateName, "index");
        });

    });

})