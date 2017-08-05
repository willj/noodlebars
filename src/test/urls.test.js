const assert = require("assert");
const urls = require("../urls");

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

});