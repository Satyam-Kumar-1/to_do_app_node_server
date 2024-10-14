import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "off", // Override unused variable rule
      "no-console": "off",
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
    },
  },
  {
    ...pluginJs.configs.recommended,
    rules: {
      ...pluginJs.configs.recommended.rules, // Inherit recommended rules
      "no-unused-vars": "off", // Override no-unused-vars rule here as well
    },
  },
];
