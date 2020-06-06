const path = require('path');

module.exports = {
  mode: 'development',
  entry: './index.ts',
  output: {
    filename: './index.js',
    path: path.resolve(__dirname, './'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
