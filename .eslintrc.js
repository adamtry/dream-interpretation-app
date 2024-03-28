module.exports = {
  extends: [
    "plugin:prettier/recommended", // must be last element in "extends"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
  },
};
