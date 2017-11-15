"use strict";

module.exports = {
    meta: {
        docs: {
            description:
                "Allow only a specified amount of parent folders ('../') in import paths",
            category: "Possible Errors",
            recommended: true
        },
        schema: [
            {
                description: "Amount of allowed '../'",
                type: "integer",
                minimum: 0
            }
        ]
    },
    create: function(context) {
        const allowed =
            typeof context.options[0] === "number" ? context.options[0] : 2;
        const pattern = /\.\.\//g;

        const message =
            "Don't use relative import paths with more than " +
            String(allowed) +
            " '../' expressions." +
            " Try using absolute paths instead.";
        return {
            ImportDeclaration: function(node) {
                if (
                    node.source &&
                    node.source.type === "Literal" &&
                    (node.source.value.match(pattern) || []).length > allowed
                ) {
                    context.report(node.source, message);
                }
            }
        };
    }
};
