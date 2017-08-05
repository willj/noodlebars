const assert = require("assert");
const settings = require("../settings");

describe("Settings", function(){

    beforeEach(function(){
        settings.init();
    });

    it("stores settings added with set and retrieves with get", function(){
        settings.addSetting("foo", "bar");

        assert.equal(settings.getSetting("foo"), "bar");
    });

    it("allows you to overwrite existing settings", function(){

        settings.addSetting("foo", "bar");
        settings.addSetting("foo", "baz");

        assert.equal(settings.getSetting("foo"), "baz");
    });

    it("uses default settings when init is not called", function(){
        assert.equal(settings.getSetting("postsPerPage"), 10);
        assert.equal(settings.getSetting("templateDir"), "./templates/");
    });

    describe("init", function(){

        it("uses default settings when no user settings passed in", function(){
            settings.init();

            assert.equal(settings.getSetting("postsPerPage"), 10);
            assert.equal(settings.getSetting("templateDir"), "./templates/");
        });

        it("overwrites default settings with user settings", function(){
            settings.init({
                postsPerPage: 20,
                siteTitle: "a new title"
            });

            assert.equal(settings.getSetting("postsPerPage"), 20);
            assert.equal(settings.getSetting("siteTitle"), "a new title");
        });

        it("adds new settings if they don't exist in defaultSettings", function(){
            settings.init({
                aNewSetting: 20,
            });

            assert.equal(settings.getSetting("aNewSetting"), 20);
        });
    });

});