module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:security/recommended",
        "eslint:recommended",
        "prettier",
    ],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "tsconfig.json",
    },
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    rules: {
        "linebreak-style": [
            "warn",
            "unix"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-angle-bracket-type-assertion": "off",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/member-delimiter-style": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars":[
            "error",
        ],
        "max-len": [
            "warn",
            {
                code: 200,
                tabWidth: 2,
                comments: 150,
                ignoreComments: false,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        "no-var": "error",
        "indent": ["error", "tab"],
        "prefer-const": "error",
    },
};
