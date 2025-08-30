import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import { configs } from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },
  configs.recommended,
]);
