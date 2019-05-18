const webpack = require('webpack');
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const projectPath = resolve(__dirname, '..');

const { NODE_ENV } = process.env;

const mode = ['production', 'development'].includes(NODE_ENV) ? NODE_ENV : 'production';
const isDevMode = mode === 'development';

const styleLoaderConfig = {
  loader: 'style-loader',
  options: {
    hmr: isDevMode,
  },
};

const cssLoaderConfig = {
  loader: 'css-loader',
  options: {
    importLoaders: 1,
    sourceMap: isDevMode,
    localIdentName: '[name]__[local]__[hash:base64:5]',
  },
};

const postCssLoaderConfig = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: isDevMode,
    plugins: [autoprefixer()],
  },
};

module.exports = {
  // the project dir
  mode,
  context: projectPath,
  entry: {
    '3d-cubes': ['./src/index'],
  },
  resolve: {
    extensions: ['.js'],
    modules: ['src', 'node_modules'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: '3D Cubes',
      template: 'src/index.html',
    }),

    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),

    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[id]-[contenthash].css',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|ico|woff)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1000,

            // NO leading slash
            name: 'images/[name]-[hash].[ext]',
          },
        },
      },
      {
        test: /\.(ttf|eot|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            // NO leading slash
            name: 'images/[name]-[hash].[ext]',
          },
        },
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/, /\.module\.scss$/],
        use: [isDevMode ? styleLoaderConfig : MiniCssExtractPlugin.loader, cssLoaderConfig, postCssLoaderConfig],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
