const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, argv) => {

  return {
    entry: {
      'all': './src/index.js',
      'sidebar': './src/components/Sidebar/index.js',
      'capitalize': './src/components/Capitalize/index.js',
      'footer': './src/components/Footer/index.js',
      'utils': './src/utils/index.js',
    },
    output: {
      path: __dirname + '/dist',
      filename: 'js/[name].js',
      libraryTarget: 'commonjs2',
    },
    // mode: 'development',
    mode: "production",
    /*mode: 'production',
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            },
          },
        })
      ]
    },*/
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          }
        },
        {
          test: /\.svg(\?.*)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'css/[name].[hash].[ext]',
              },
            },
            {loader: 'svg-transform-loader'},
          ],
        },
        {
          test: /\.(less|css|sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
              }
            },
            {
              loader: 'svg-transform-loader/encode-query',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')({})],
              }
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          // ASSET LOADER
          // Reference: https://github.com/webpack/file-loader
          // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
          // Rename the file using the asset hash
          // Pass along the updated reference to your code
          // You can add here any file extension you want to get copied to your output
          test: /\.(png|jpg|jpeg|gif|woff|otf|woff2|ttf|eot|mov|mp4|ico)$/,
          loader: 'file-loader',
          options: {
            name: 'css/[name].[ext]',
          },
          exclude: /index\.html$/
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.css', '.less'],
    },
    // target: 'web',
    externals: [
      {
        'react': {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react'
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom'
        },
        'react-router-dom': 'commonjs react-router-dom',
        // 'react-router-dom': {
        //   root: 'ReactRouterDOM',
        //   commonjs2: 'react-router-dom',
        //   commonjs: 'react-router-dom',
        //   amd: 'react-router-dom'
        // },
        // 'devextreme-react/tree-view': 'commonjs devextreme-react/tree-view',
        // 'devextreme-react/button': 'commonjs devextreme-react/button',
        // 'react-router': 'commonjs react-router',
        // classnames: 'commonjs classnames'
      },
    ],
    plugins: [
      new CleanWebpackPlugin({
        verbose: true,
        dry: false
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "css/[name].css",
      }),
    ]
  }
};
