const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@stores': path.resolve(__dirname, 'src/stores/'),
      '@hooks': path.resolve(__dirname, 'src/utils/Hooks.js'),
      '@components': path.resolve(__dirname, 'src/components/')
    },
    extensions: ['.js', '.jsx', '.json', '.css', '.less'],
  }
};
