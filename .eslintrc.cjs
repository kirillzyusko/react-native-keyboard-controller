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
  ],
  extends: [
    "@react-native",
    "prettier",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:import/typescript",
    "plugin:eslint-comments/recommended",
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
    // react
    "react-hooks/exhaustive-deps": "warn",
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
  ],
  env: {
    "react-native/react-native": true,
    "jest/globals": true,
  },
  ignorePatterns: ["node_modules/**", "lib/**", "scripts/**"],
};
