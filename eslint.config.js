import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  {
    ignores: ['dist', 'dist-preview', 'dev-dist', 'node_modules', 'coverage', 'playwright-report', 'test-results', '**/*.svg'],
  },
  { files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2022, ...globals.node },
    },
    settings: { react: { version: '18.3' } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // v7's bundled configs replace the old minimal set with a much
      // stricter "React Compiler" rule set (purity, refs, set-state-in-effect...);
      // keep just the two classic hook rules the project relied on before.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]
