const webpack = require('webpack');
const merge = require('webpack-merge');
const { resolve } = require('path');

const config = require('./webpack.base.config');
const projectPath = resolve(__dirname, '..');

module.exports = merge.strategy({
  entry: 'prepend',
})(config, {
  devtool: 'eval-source-map',

  entry: {
    '3d-cubes': ['webpack-dev-server/client?http://localhost:3000', 'webpack/hot/dev-server'],
  },

  output: {
    filename: '[name].js',
    path: `${projectPath}/build`,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

console.log('Webpack HOT dev build for Rails'); // eslint-disable-line no-console
