/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');


module.exports = {
  entry: './src/AcmeSdk.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  watchOptions:{
    ignored: path.resolve(__dirname, 'dist/**')
  },
  output: {
    filename: 'acme-sdk.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'acmeSdk',
      type: 'umd',
    },
  },
};