import * as path from 'path';
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@debug/ui-theme': path.resolve(
        __dirname,
        '../../../../node_modules/@debug/ui-theme'
      ),
    };
    return config;
  },
};

export default config;
