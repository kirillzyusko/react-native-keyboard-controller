module.exports = {
  root: true,
  plugins: [
    "@typescript-eslint",
    "react",
    "react-native",
    "jest",
    "import",
    "react-compiler",
    "eslint-comments",
    "prettier",
    "react-perf",
    "jsdoc",
  ],
  extends: [
    "@react-native",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:import/typescript",
    "plugin:eslint-comments/recommended",
    "plugin:react-perf/recommended",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "<root>/tsconfig.json",
      },
    },
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        quoteProps: "consistent",
        trailingComma: "all",
      },
    ],
    // react-hooks
    "react-hooks/exhaustive-deps": "warn",
    // react
    "react/jsx-sort-props": [
      "error",
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: true,
        noSortAlphabetically: false,
        reservedFirst: ["ref", "key"],
      },
    ],
    "react/jsx-no-bind": [
      "warn",
      {
        // should be an error, but we need to fix a lot of places
        ignoreDOMComponents: false,
        ignoreRefs: false,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false,
      },
    ],
    // react-perf
    "react-perf/jsx-no-new-function-as-prop": "off", // because we have jsx-no-bind
    "react-perf/jsx-no-jsx-as-prop": "warn",
    "react-perf/jsx-no-new-array-as-prop": "warn",
    "react-perf/jsx-no-new-object-as-prop": "warn",
    // typescript
    "@typescript-eslint/consistent-type-imports": [
      "error",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/no-var-requires": "warn",
    // import
    "sort-imports": [
      "error",
      {
        // sort destructure imports
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
        allowSeparatedGroups: true,
      },
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type",
        ],
        "alphabetize": {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
      },
    ],
    "import/no-cycle": ["error", { maxDepth: "∞" }],
    // jest
    "jest/expect-expect": [
      "warn",
      {
        assertFunctionNames: [
          "expect",
          "expectBitmapsToBeEqual",
          "expectElementBitmapsToBeEqual",
        ],
        additionalTestBlockFunctions: [],
      },
    ],
    // react-compiler
    "react-compiler/react-compiler": "error",
    // eslint-comments
    "eslint-comments/no-unused-disable": "error",
    // eslint
    "curly": "error",
    "eqeqeq": ["error", "always"], // check “===”
    "no-nested-ternary": "error",
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: "*",
        next: ["return", "try", "throw", "function", "for", "while", "do"],
      },
      { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
      { blankLine: "always", prev: "*", next: "if" },
      { blankLine: "any", prev: "if", next: "if" },
    ],
    "no-param-reassign": "error",
    "max-lines": ["warn", { max: 300 }],
  },
  overrides: [
    {
      files: ["src/specs/**"],
      rules: {
        "@typescript-eslint/ban-types": [
          "error",
          {
            extendDefaults: true,
            types: {
              "{}": false,
            },
          },
        ],
      },
    },
    {
      files: ["src/**"],
      excludedFiles: ["src/specs/**"],
      rules: {
        "jsdoc/check-access": "error",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": 1,
        "jsdoc/check-line-alignment": 1,
        "jsdoc/check-param-names": "error",
        "jsdoc/check-template-names": 1,
        "jsdoc/check-property-names": "error",
        "jsdoc/check-syntax": 1,
        "jsdoc/check-tag-names": ["error", { definedTags: ["platform"] }],
        "jsdoc/check-types": "error",
        "jsdoc/check-values": "error",
        "jsdoc/empty-tags": "error",
        "jsdoc/implements-on-classes": "error",
        "jsdoc/informative-docs": 1,
        "jsdoc/match-description": 1,
        "jsdoc/multiline-blocks": "error",
        "jsdoc/no-bad-blocks": 1,
        "jsdoc/no-blank-block-descriptions": 1,
        "jsdoc/no-defaults": 1,
        "jsdoc/no-multi-asterisks": "error",
        "jsdoc/no-types": 1,
        "jsdoc/require-asterisk-prefix": 1,
        "jsdoc/require-description": 1,
        "jsdoc/require-description-complete-sentence": 1,
        "jsdoc/require-example": 1,
        "jsdoc/require-hyphen-before-param-description": 1,
        "jsdoc/require-jsdoc": "error",
        "jsdoc/require-param": "error",
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-description": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-returns": "error",
        "jsdoc/require-returns-check": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-template": 1,
        "jsdoc/require-throws": 1,
        "jsdoc/require-yields": "error",
        "jsdoc/require-yields-check": "error",
        "jsdoc/sort-tags": 1,
        "jsdoc/tag-lines": ["error", "never", { startLines: 1 }],
        "jsdoc/valid-types": "error",
        "jsdoc/no-restricted-syntax": "off",
        "jsdoc/require-file-overview": "off",
        "jsdoc/no-missing-syntax": "off",
        "jsdoc/check-examples": "off",
        "jsdoc/no-undefined-types": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-property-type": "off",
        "jsdoc/require-returns-type": "off",
      },
    },
  ],
  env: {
    "react-native/react-native": true,
    "jest/globals": true,
  },
  ignorePatterns: ["node_modules/**", "lib/**", "scripts/**", "docs/build/**"],
};
