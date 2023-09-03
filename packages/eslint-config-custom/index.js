/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "turbo",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  root: true,
};
