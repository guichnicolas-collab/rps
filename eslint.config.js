// eslint.config.mjs
import globals from "globals";
import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // Base JS rules
  js.configs.recommended,

  // React + JSX + Hooks
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
    },
    rules: {
      // Your custom JS rules
      "prefer-const": "error",
      semi: ["error", "always"],
      quotes: ["error", "single", { avoidEscape: true }],
      eqeqeq: ["error", "always"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      // React recommended rules
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Prettier rules override
      ...prettierConfig.rules,
    },
    settings: { react: { version: "detect" } },
  },
]);
