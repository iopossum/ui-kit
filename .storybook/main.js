const path = require('path');

module.exports = {
  addons: [/*'@storybook/addon-knobs/register', '@storybook/addon-postcss'*/],
  stories: ['../src/**/*.stories.js'],
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
    
    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader'
      ],
      include: path.resolve(__dirname, '../'),
    });

    config.module.rules.push({
      test: /\.css/,
      use: [
        'style-loader',
        'css-loader'
      ],
      include: path.resolve(__dirname, '../node_modules/devextreme'),
    });

    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@utils'] = path.resolve(__dirname, '../src/utils/');
    config.resolve.alias['@stores'] = path.resolve(__dirname, '../src/stores/');
    config.resolve.alias['@hooks'] = path.resolve(__dirname, '../src/utils/Hooks.js');
    config.resolve.alias['@components'] = path.resolve(__dirname, '../src/components/');
    config.resolve.alias['assetsDir'] = path.resolve(__dirname, '../src/styles');
    config.resolve.alias['react'] = path.resolve(__dirname, '../node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, '../node_modules/react-dom');

    // Return the altered config
    return config;
  },
};
