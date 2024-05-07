module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  // extends: [
  //   'eslint:recommended',
  //   'plugin:@typescript-eslint/strict-type-checked',
  //   'plugin:react-hooks/recommended',
  //   'plugin:@typescript-eslint/stylistic-type-checked',
  //   'plugin:react/recommended',
  //   'plugin:react/jsx-runtime',
  //   'airbnb',
  //   'airbnb-typescript'
  // ],

  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended-type-checked', // @typescript-eslint @v6
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',

  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // "semi": ["error", "always"],
    // "prefer-arrow-callback": "error",
    // "arrow-spacing": ["error", { "before": true, "after": true }],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": "off",
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
