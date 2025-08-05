import jest from 'eslint-plugin-jest';
import nx from '@nx/eslint-plugin';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  prettier,

  {
    ignores: [
      // General
      '**/node_modules/**',
      '**/dist/**',
      '**/tmp/**',
      '**/coverage/**',

      // Tooling and configs
      '**/package-lock.json',
      '**/pnpm-lock.yaml',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/jest.preset.js',

      // Storybook config
      '**/.storybook/**',

      // Custom ESLint modules
      'eslint.config.mjs',
      'eslint.angular-selector-rules.mjs',
      'commitlint.config.js',
    ],
  },

  // JavaScript file restrictions
  {
    files: ['**/*.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message:
            '❌ JavaScript files are not allowed. Use TypeScript instead.',
        },
      ],
    },
  },

  // Enforce module boundaries on TS files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        { accessibility: 'explicit' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },

  // Unit tests
  {
    files: ['**/*.spec.ts'],
    plugins: { jest },
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'jest/expect-expect': 'warn',
      'jest/no-disabled-tests': 'warn',
      'jest/no-identical-title': 'error',
      'jest/no-commented-out-tests': 'warn',
    },
  },

  // Cypress
  {
    files: ['cypress/**/*.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
    },
  },

  // Always apply import sorting
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
];
