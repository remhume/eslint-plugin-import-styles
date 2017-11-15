var rule = require("../../../lib/rules/max-parents"); // lol!
var RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester({
    parserOptions: { ecmaVersion: 6, sourceType: "module" }
});

function getCase(path, num, error) {
    return {
        code: "import foo from '" + path + "';",
        options: typeof num !== "undefined" ? [num] : undefined,
        errors: error ? [{ message: error }] : undefined
    };
}

function getMessage(num) {
    return (
        "Don't use relative import paths with more than " +
        String(num) +
        " '../' expressions." +
        " Try using absolute paths instead."
    );
}

ruleTester.run("example", rule, {
    valid: [
        getCase("bar", 2),
        getCase("bar/baz", 2),
        getCase("./bar/baz", 2),
        getCase("./../bar/baz", 2),
        getCase("./../../bar/baz", 2),
        getCase("../../bar/baz", 2),
        getCase("bar/../baz/../bat", 2),
        // test default value of 2
        getCase("../../bar/baz"),
        // test 0
        getCase("./bar", 0)
    ],

    invalid: [
        getCase("../../../bar/baz", 2, getMessage(2)),
        getCase("./.././../../bar/baz", 2, getMessage(2)),
        getCase("./bar/../baz/../../bat", 2, getMessage(2)),
        getCase("../bar", 0, getMessage(0))
    ]
});
