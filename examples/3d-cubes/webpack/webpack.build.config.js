const webpack = require('webpack');
const { resolve } = require('path');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { env } = require('process');

const config = require('./webpack.base.config');
const projectPath = resolve(__dirname, '..');

const devBuild = env.NODE_ENV === 'development';

const buildConfig = {
  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].chunk.js',
    path: `${projectPath}/build`,
  },
};

if (devBuild) {
  console.log('Webpack dev build'); // eslint-disable-line no-console

  buildConfig.devtool = 'eval-source-map';
} else {
  console.log(`Webpack ${env.NODE_ENV} build`); // eslint-disable-line no-console

  // TODO: should use webpack merge to handle different configs
  buildConfig.optimization = {
    minimizer: [new TerserPlugin({ sourceMap: false }), new OptimizeCSSAssetsPlugin({})],
  };

  buildConfig.plugins = [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ];
}

module.exports = merge(config, buildConfig);
