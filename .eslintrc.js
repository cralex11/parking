module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "airbnb",
    "eslint:recommended", 
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/babel",
    "prettier/react",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier',
  ],
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": [
      "error", { "allow": ["__REDUX_DEVTOOLS_EXTENSION__"] }
    ],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  },
};