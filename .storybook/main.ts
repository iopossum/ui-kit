const path = require('path');

module.exports = {
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
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
  stories: ['../src/**/*.stories.tsx'],  
  framework: '@storybook/react',
  core: {
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
      },
    },
  },
  features: {
    storyStoreV7: true,
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    config.module.rules.push({
      test: /\.scss/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@utils'] = path.resolve(__dirname, '../src/utils/');
    config.resolve.alias['@stores'] = path.resolve(__dirname, '../src/stores/');
    config.resolve.alias['@hooks'] = path.resolve(__dirname, '../src/utils/Hooks');
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