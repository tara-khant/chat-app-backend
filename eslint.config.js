import eslintPluginImport from 'eslint-plugin-import';

export default {
  files: ['**/*.js'],
  env: {
    node: true,
    es2025: true,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: {
    import: eslintPluginImport,
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
    'import/extensions': ['error', 'always', { js: 'always' }],
    'import/no-unresolved': ['error', { commonjs: false, amd: false }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
};
