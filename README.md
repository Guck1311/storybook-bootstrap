# Frontend Core (Angular Standalone Library)

This repository contains the **frontend-core** Angular library with Nx monorepo setup, fully configured for:

- Nx workspace (package-based layout)
- Angular standalone component architecture
- Storybook for isolated component development
- Jest for unit testing
- ESLint (Google style + Nx module boundaries)
- Prettier (Google style)
- Cypress Component Testing (workaround for standalone Angular library until Nx 22)

---

## Setup

### Install dependencies

npm install

---

## Development scripts

| Script                    | Description                                     |
| ------------------------- | ----------------------------------------------- |
| npm run build             | Builds the Angular package (ng-packagr)         |
| npm run cypress-component | Runs Cypress component tests (workaround setup) |
| npm run storybook         | Starts Storybook                                |
| npm run storybook:build   | Builds Storybook static site                    |
| npm run lint              | Runs full lint (eslint, prettier)               |
| npm run lint:fix          | Auto-fixes lint issues                          |
| npm run format            | Formats code using Prettier & sort-package-json |
| npm run format:check      | Checks formatting without modifying             |
| npm run type-check        | Type-checks the full workspace                  |
| npm run prepare           | Initializes Husky hooks                         |

---

## Linting & Formatting

- ESLint configured via eslint.config.mjs (flat config)
- Enforces:
  - Google TypeScript style (@typescript-eslint)
  - Simple import sorting
  - Module boundaries via @nx/enforce-module-boundaries
  - No raw JavaScript files (only allowed for configuration files)
- Prettier configured via .prettierrc using Google style guidelines

---

## Commit workflow

- Commit messages validated using commitlint (Conventional Commits)
- Husky Git hooks:
  - pre-commit: Blocks new non-config JS/MJS files, runs lint-staged
  - commit-msg: Runs commitlint
  - pre-push: Runs either affected tests (if origin/develop exists) or full test suite

Example commit message (enforced):

feat(button): add loading spinner to button

---

## Storybook

- Fully integrated using @storybook/angular
- Supports SCSS preprocessing
- Custom theme imports via stylePreprocessorOptions alias configuration

---

## Cypress Component Testing (Current Workaround)

### Why this workaround exists:

Nx 21.x does not officially support Cypress Component Testing for Angular libraries using standalone components. The official Nx generator @nx/angular:cypress-component-configuration only works for Angular applications (not libraries) and requires Nx 22+.

Since we are using a pure Angular standalone library inside an Nx workspace, Cypress CT cannot work out-of-the-box. Therefore, a custom workaround has been implemented to allow Cypress CT to function temporarily.

---

## Workarounds

### 1️⃣ Dummy angular.json (root-level)

```
{
  "version": 1,
  "projects": {
    "core": {
      "projectType": "application",
      "root": "projects/shared",
      "sourceRoot": "projects/shared/src",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/core",
            "index": "projects/shared/src/index.html",
            "main": "projects/shared/src/main.ts",
            "tsConfig": "tsconfig.json",
            "styles": [],
            "scripts": []
          }
        }
      }
    }
  },
  "defaultProject": "core"
}
```

- ⚠ This file only exists so Cypress can find an Angular build configuration. Nx itself does not use this file.

---

### 2️⃣ Dummy tsconfig.json inside projects/shared/

{
"extends": "../../tsconfig.base.json",
"files": []
}

- ⚠ Required for Angular Devkit compatibility when Cypress tries to parse Angular configs.

---

### 3️⃣ Custom Cypress Config (projects/shared/cypress.config.ts)

import { defineConfig } from 'cypress';
import path from 'path';
import webpackConfig from './cypress/webpack.config.js';

export default defineConfig({
component: {
devServer: {
bundler: 'webpack',
framework: 'angular',
webpackConfig,
},
specPattern: '\*_/_.cy.ts',
supportFile: path.resolve(\_\_dirname, 'cypress/component.ts'),
},
});

- ⚠ Fully manual config to bypass Nx plugins for CT.

---

## Nx Workspace Layout

```
angular-core/
├── node_modules/
├── cypress/
│      ├── component.ts  ← Cypress support file
│      └── webpack.config.js  ← Custom Cypress CT webpack config
├── dist/
├── projects/
│   └── shared/
│       ├── src/
│       │   └── lib/
│       │       ├── assets/
│       │       ├── components/
│       │       ├── icons/
│       │       ├── services/
│       │       └── theme/
│       └── .storybook/
├── angular.json ← dummy (Cypress only)
├── tsconfig.base.json
├── package.json
├── README.md
└── config files (.eslintrc, .prettierrc, husky, commitlint, etc.)
```

---

## Upgrade Plan (Nx 22+)

Once Nx 22 releases on npm:

- Delete angular.json (not needed anymore)
- Delete dummy tsconfig.json
- Delete custom cypress.config.ts and webpack.config.js
- Run the official Nx generator:

npx nx g @nx/angular:cypress-component-configuration --project=core

Native Cypress Component Testing will then fully work inside Nx.

---

## ⚠ Limitations

- The current workaround only works for Angular standalone libraries.
- All custom config is strictly limited to Cypress CT.
- This setup is intentionally temporary until official Nx 22 support.

---

## Summary

The core Nx workspace is fully functional and properly configured for Angular 19.

Cypress Component Testing is manually configured using a minimal workaround.

After Nx 22 release, this repo can be simplified and cleaned up significantly.
