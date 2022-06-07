module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    parser: '@babel/eslint-parser',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
    'no-trailing-spaces': 'error',
    'no-prototype-builtins': 'off',
    'prefer-const': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'curly': 'error',
    'no-param-reassign': 'error',
    'no-multi-assign': 'error',
    'consistent-return': 'error',
    'no-lonely-if': 'error',
    'no-else-return': ['error', { 'allowElseIf': true }],
    'no-var': 'error',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'no-undef': 'error',
    'eqeqeq': ['error', 'smart'],
    'no-return-assign': 'error',
    'prefer-destructuring': 'error',
    'prefer-template': 'error',
  },
};
