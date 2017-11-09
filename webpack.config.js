const path = require('path');

module.exports = {
  entry: './src/annotate.js',

  output: {
    path: path.resolve('public'),
    filename: 'bundle.js',
  },
  devtool: '#cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
};
