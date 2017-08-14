const assert = require("assert");
const settings = require("../settings");
const urls = require("../urls")(settings);

describe("Urls", function(){

    describe("getSlug", function(){

        it("returns a lowercase string", function(){

            let slug = urls.getSlug("PAGETITLE");

            assert.strictEqual(slug, "pagetitle");
        });

        it("replaces all none alpha numeric chars with hyphens", function(){

            let testString = "a-b c_d.e~f!g\\h/i|j?k#l@m:n;o'p£q$r%s^t&u*v(w)x+y=z[0]1{2}3<4>5,6`7¬8";
            let expectedSlug = "a-b-c-d-e-f-g-h-i-j-k-l-m-n-o-p-q-r-s-t-u-v-w-x-y-z-0-1-2-3-4-5-6-7-8";

            let slug = urls.getSlug(testString);

            assert.equal(slug, expectedSlug);
        });

        it("replaces multiple concurrent none alpha numeric chars with a single hyphen", function(){
            let testString = "test@+for./hyphens";
            let expectedSlug = "test-for-hyphens";

            let slug = urls.getSlug(testString);

            assert.equal(slug, expectedSlug);
        });

        it("does not start or end with a hyphen", function(){
            let testString = "-test@+for./hyphens+";
            let expectedSlug = "test-for-hyphens";

            let slug = urls.getSlug(testString);

            assert.equal(slug, expectedSlug);
        });

        it("returns an empty string if no alpha numeric chars are present", function(){
            let testString = "-@+";
            let expectedSlug = "";

            let slug = urls.getSlug(testString);

            assert.strictEqual(slug, expectedSlug);
        });

    });

    describe("getUrlPath", function(){

        it("returns the permalink if one is provided in pageAttributes", function(){
            let pageAttributes = {
                permalink: "projects/project-1.html"
            };

            let expectedResult = {
                path: "projects/",
                fileName: "project-1.html",
                permalink: "/projects/project-1.html"
            };

            let urlPath = urls.getUrlPath("test/files", "project-page.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

        it("returns the correct path and filename as index.html when the permalink has no extension", function(){
            let pageAttributes = {
                permalink: "projects/project-2"
            };

            let expectedResult = {
                path: "projects/project-2/",
                fileName: "index.html",
                permalink: "/projects/project-2/"
            };

            let urlPath = urls.getUrlPath("test/files", "project-page.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

        it("returns a path containing the date for posts when useDateInPostUrls is enabled", function(){
            let pageAttributes = {
                type: "post",
                postDate: new Date(2020, 11, 25),
                title: "Hello World"
            };

            settings.addSetting("useDateInPostUrls", true);
            settings.addSetting("removeFileExtFromUrls", true);

            let expectedResult = {
                path: "2020/12/hello-world/",
                fileName: "index.html",
                permalink: "/2020/12/hello-world/"
            };

            let urlPath = urls.getUrlPath("test/files", "a-post.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

        it("returns a path that matches post title when useDateInPostUrls is disabled", function(){
            let pageAttributes = {
                type: "post",
                postDate: new Date(2020, 11, 25),
                title: "Hello World"
            };

            settings.addSetting("useDateInPostUrls", false);
            settings.addSetting("removeFileExtFromUrls", true);

            let expectedResult = {
                path: "hello-world/",
                fileName: "index.html",
                permalink: "/hello-world/"
            };

            let urlPath = urls.getUrlPath("test/files", "a-post.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

        it("returns a path with date and a fileName that matches post title when removeFileExtFromUrls is false and useDateInPostUrls is true", function(){
            let pageAttributes = {
                type: "post",
                postDate: new Date(2020, 11, 25),
                title: "Hello World"
            };

            settings.addSetting("useDateInPostUrls", true);
            settings.addSetting("removeFileExtFromUrls", false);

            let expectedResult = {
                path: "2020/12/",
                fileName: "hello-world.html",
                permalink: "/2020/12/hello-world.html"
            };

            let urlPath = urls.getUrlPath("test/files", "a-post.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

        it("returns a path with no date and a fileName that matches post title when removeFileExtFromUrls and useDateInPostUrls are false", function(){
            let pageAttributes = {
                type: "post",
                postDate: new Date(2020, 11, 25),
                title: "Hello World"
            };

            settings.addSetting("useDateInPostUrls", false);
            settings.addSetting("removeFileExtFromUrls", false);

            let expectedResult = {
                path: "",
                fileName: "hello-world.html",
                permalink: "/hello-world.html"
            };

            let urlPath = urls.getUrlPath("test/files", "a-post.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

        it("returns a path matching the file path with the filename as index.html when no permalink supplied, is not a post, and removeFileExtFromUrls is true", function(){
            let pageAttributes = {
                type: "page"
            };

            settings.addSetting("removeFileExtFromUrls", true);

            let expectedResult = {
                path: "test/about/",
                fileName: "index.html",
                permalink: "/test/about/"
            };

            let urlPath = urls.getUrlPath("test", "about.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

        it("returns a path matching the file path and matching filenames when no permalink supplied, is not a post, and removeFileExtFromUrls is false", function(){
            let pageAttributes = {
                type: "page"
            };

            settings.addSetting("removeFileExtFromUrls", false);

            let expectedResult = {
                path: "test",
                fileName: "about.html",
                permalink: "/test/about.html"
            };

            let urlPath = urls.getUrlPath("test", "about.html", pageAttributes);

            assert.deepEqual(urlPath, expectedResult);
        });

    });

});