import eslintPluginImport from 'eslint-plugin-import';

export default {
  files: ['**/*.js'],
  env: {
    node: true, // Node.js globals like process, __dirname
    es2025: true, // modern ES features
  },
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module', // important for "type: module"
  },
  plugins: {
    import: eslintPluginImport,
  },
  rules: {
    'no-console': 'off', // allow console.log
    'no-unused-vars': 'warn', // warn on unused variables

    // Require .js extensions for local imports
    'import/extensions': ['error', 'always', { js: 'always' }],

    // Throw error if import cannot be resolved (missing module)
    'import/no-unresolved': ['error', { commonjs: false, amd: false }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src'], // resolve imports from src/ and node_modules
      },
    },
  },
};
