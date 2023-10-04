module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'jest'],
  extends: [
    '@react-native',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        quoteProps: 'consistent',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        useTabs: false,
      },
    ],
    // react
    'react-hooks/exhaustive-deps': 'warn',
    // typescript
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/no-var-requires': 'warn',
  },
  env: {
    'react-native/react-native': true,
    'jest/globals': true,
  },
  ignorePatterns: [
    'node_modules/**',
    'lib/**',
    'example/**',
    'FabricExample/**',
    'docs/**',
    'scripts/**',
  ],
};
