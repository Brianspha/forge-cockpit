module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2022,
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:vuejs-accessibility/recommended',
    'prettier',
  ],
  plugins: ['vue', '@typescript-eslint', 'import', 'vuejs-accessibility'],
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.ts', '.vue'],
      },
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-empty-function': 'warn',

    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/prefer-readonly': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',

    'vue/multi-word-component-names': 'off', 
    'vue/no-v-html': 'error',
    'vue/component-tags-order': [
      'error',
      { order: ['script', 'template', 'style'] },
    ],
    'vue/define-macros-order': [
      'error',
      { order: ['defineProps', 'defineEmits', 'defineExpose', 'withDefaults'] },
    ],
    'vue/props-order': [
      'error',
      {
        order: ['DEFINITION', 'TYPE', 'DEFAULT', 'VALIDATOR', 'REQUIRED'],
      },
    ],
    'vue/require-name-property': 'error',
    'vue/html-self-closing': [
      'error',
      {
        html: { void: 'always', normal: 'never', component: 'always' },
      },
    ],

    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'index'],
          'sibling',
          'type',
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],
    'import/no-unresolved': 'error',
    'import/no-duplicates': 'error',
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/*.spec.{j,t}s?(x)'],
      env: { jest: true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
    {
      files: ['src/views/HomeView.vue'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
  ],
  ignorePatterns: ['dist/', 'node_modules/', '*.d.ts', 'vite.config.ts'],
};