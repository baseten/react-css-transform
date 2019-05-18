/* eslint-disable no-console */
const webpack = require('webpack');
const { resolve } = require('path');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.hot.config');
const compiler = webpack(webpackConfig);

const projectPath = resolve(__dirname, '..');

const devServer = new WebpackDevServer(compiler, {
  publicPath: '/',
  contentBase: resolve(projectPath, 'build'),
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  disableHostCheck: true,
  clientLogLevel: 'info',
  hot: true,
  inline: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  lazy: false,
  stats: {
    colors: true,
    hash: false,
    version: false,
    chunks: false,
    children: false,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
});

devServer.listen('3000', '0.0.0.0', err => {
  if (err) console.error(err);
  console.log(`=> 🔥  Webpack development server is running on http://0.0.0.0:3000`);
});
