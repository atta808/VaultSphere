module.exports = {
  extends: ["expo"],
  ignorePatterns: ["/dist/*", "/node_modules/*"],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  globals: {
    __DEV__: true,
  },
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
    "import/namespace": "off",
    "import/no-unresolved": ["error", { ignore: ["expo-sharing"] }]
  }
};
