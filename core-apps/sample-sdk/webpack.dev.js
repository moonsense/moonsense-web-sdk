/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
});