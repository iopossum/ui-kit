import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const cfg: StorybookConfig = {
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      savePropValueAsString: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        return true;
      },
    },
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
    'storybook-addon-react-router-v6',
  ],
  stories: ['../src/**/*.stories.tsx'],
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
  features: {
    storyStoreV7: true,
  },
  docs: {
    autodocs: true,
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        fsCache: true,
        lazyCompilation: true,
      },
    },
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@utils'] = path.resolve(__dirname, '../src/utils/');
    config.resolve.alias['@stores'] = path.resolve(__dirname, '../src/stores/');
    config.resolve.alias['@hooks'] = path.resolve(__dirname, '../src/hooks');
    config.resolve.alias['@components'] = path.resolve(__dirname, '../src/components/');
    config.resolve.alias['@types'] = path.resolve(__dirname, '../src/types/index');
    config.resolve.alias['@.storybook/decorators'] = path.resolve(__dirname, './decorators');
    config.resolve.alias['./assets/img'] = path.resolve(__dirname, '../src/styles/img');
    config.resolve.alias['react'] = path.resolve(__dirname, '../node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, '../node_modules/react-dom');

    // Return the altered config
    return config;
  },
};

export default cfg;
