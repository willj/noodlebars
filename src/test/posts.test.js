const assert = require("assert");
const settings = require("../settings");
const initPosts = require("../posts");
let posts = initPosts(settings);

let dummyPosts = [
    {
        fileSource: "./posts/post1.md",
        fileDestination: "./output/post1.html",
        doc: {
            date: "2020/12/25 00:10:20"
        }
    },
    {
        fileSource: "./posts/post2.md",
        fileDestination: "./output/post2.html",
        doc: {
            date: "2020/12/25 00:10:20"
        }
    },
    {
        fileSource: "./posts/post3.md",
        fileDestination: "./output/post3.html",
        doc: {
            date: "2015/12/25 00:10:20"
        }
    }
];

describe("posts", function(){

    beforeEach(function(){
        posts = initPosts(settings);
    });

    describe("getPostDate", function(){

        it("returns a Date object matching the datestring input", function(){
            let dateString = "2020/12/25";

            let date = posts.getPostDate(dateString);

            assert.equal(date.getFullYear(), 2020);
            assert.equal(date.getMonth(), 11);    // Silly 0 based JS months
            assert.equal(date.getDate(), 25);
        });

        it("returns 1970/1/1 when an invalid date is passed in", function(){
            let date1 = posts.getPostDate("cheese");
            let date2 = posts.getPostDate("2015/5/32");

            assert.equal(date1.getFullYear(), 1970);
            assert.equal(date1.getMonth(), 0);    // Silly 0 based JS months
            assert.equal(date1.getDate(), 1);

            assert.equal(date2.getFullYear(), 1970);
            assert.equal(date2.getMonth(), 0);    // Silly 0 based JS months
            assert.equal(date2.getDate(), 1);
        });
    });

    describe("indexPost", function(){
        
        it("should add the post to the posts object", function(){

            let expectedPostKey = "p-1608855020000-0";

            let expectedPostModel = {
                fileSource: dummyPosts[0].fileSource,
                fileDestination: dummyPosts[0].fileDestination,
                attributes: dummyPosts[0].doc,
                postDate: new Date(dummyPosts[0].doc.date)
            };

            posts.indexPost(dummyPosts[0]);

            assert.deepEqual(posts.getPosts()[expectedPostKey], expectedPostModel);
        });

        it("should index posts with the same date/time with different keys", function(){

            let expectedPostKey1 = "p-1608855020000-0";
            let expectedPostKey2 = "p-1608855020000-1";

            posts.indexPost(dummyPosts[0]);
            posts.indexPost(dummyPosts[1]);

            assert.equal(expectedPostKey1 in posts.getPosts(), true);
            assert.equal(expectedPostKey2 in posts.getPosts(), true);
        });

    });

    describe("getPostPagePath", function(){

        it("returns index.html when the postsPermalink is not set", function(){
            settings.addSetting("postsPermalink", "");
            
            let path = posts.getPostPagePath();

            assert.deepEqual(path, { path: "", fileName: "index.html"});
        });

        it("returns the path and filename when postsPermalink has both", function(){
            settings.addSetting("postsPermalink", "blog/index.html");
            
            let path = posts.getPostPagePath();

            assert.deepEqual(path, { path: "blog/", fileName: "index.html"});
        });

        it("returns the directory name and filename set to index.html when postsPermalink has no extension", function(){
            settings.addSetting("postsPermalink", "blog");
            
            let path = posts.getPostPagePath();
            
            assert.deepEqual(path, { path: "blog/", fileName: "index.html"});
        });

        it("returns the full path and filename set to index.html when postsPermalink has no extension", function(){
            settings.addSetting("postsPermalink", "words/blog/one");
            
            let path = posts.getPostPagePath();
            
            assert.deepEqual(path, { path: "words/blog/one/", fileName: "index.html"});
        });

    });

    describe("generatePagingLinks", function(){

        let postPath = {
            path: "",
            fileName: "index.html"
        };

        it("returns null for previous next when there's only one page", function(){

            let paging = posts.generatePagingLinks(1, 1, postPath);

            assert.equal(paging.previous, null);
            assert.equal(paging.next, null);
        });

        it("returns null for previous and a path for next when you're on page 1 of 10", function(){
            let paging = posts.generatePagingLinks(1, 10, postPath);

            assert.equal(paging.previous, null);
            assert.equal(paging.next, "/page/2");
        });

        it("returns links for previous and next when you're on page 2 of 10", function(){
            let paging = posts.generatePagingLinks(2, 10, postPath);

            assert.equal(paging.previous, "/index.html");
            assert.equal(paging.next, "/page/3");
        });

        it("returns links for prev and next with a custom posts permalink", function(){
            let pp = {
                path: "blog/",
                fileName: "index.html"
            };

            let paging = posts.generatePagingLinks(2, 10, pp);

            assert.equal(paging.previous, "/blog/index.html");
            assert.equal(paging.next, "/blog/page/3");
        });

        it("returns link for previous and null for next when on page 10 of 10", function(){
            let paging = posts.generatePagingLinks(10, 10, postPath);
            
            assert.equal(paging.previous, "/page/9");
            assert.equal(paging.next, null);
        });

    });

});