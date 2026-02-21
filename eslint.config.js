// eslint.config.js
import js from "@eslint/js";


export default [
js.configs.recommended,


{
files: ["**/*.{js,jsx}"],
languageOptions: {
ecmaVersion: "latest",
sourceType: "module",
globals: {
window: "readonly",
document: "readonly",
console: "readonly",
},
},


rules: {
/* ===== Possible Errors ===== */
"no-undef": "error",
"no-unreachable": "error",
"no-extra-semi": "error",
"no-constant-condition": "error",


/* ===== Best Practices ===== */
"eqeqeq": ["error", "always"],
"curly": ["error", "all"],
"no-eval": "error",
"no-implied-eval": "error",
"no-return-await": "error",


/* ===== Variables ===== */
"no-unused-vars": [
"error",
{
args: "after-used",
vars: "all",
ignoreRestSiblings: true,
varsIgnorePattern: "^_",
argsIgnorePattern: "^_",
ignoreExports: true,
},
],


/* ===== Modern JS ===== */
"prefer-const": "error",
"no-var": "error",
"object-shorthand": ["error", "always"],


/* ===== Style (strict but readable) ===== */
"semi": ["error", "always"],
"quotes": ["error", "single", { "avoidEscape": true }],
"comma-dangle": ["error", "always-multiline"],


/* ===== Debugging ===== */
"no-debugger": "error",
"no-alert": "error",


/* ===== Complexity control ===== */
"complexity": ["warn", 15],
"max-depth": ["warn", 4],
"max-params": ["warn", 4],
},
},
];