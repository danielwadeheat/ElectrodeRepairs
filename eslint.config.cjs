const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        document: "readonly",
        HTMLElement: "readonly",
        navigator: "readonly",
        Node: "readonly",
        URL: "readonly",
        window: "readonly"
      }
    }
  }
];
