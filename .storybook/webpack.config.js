// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const path = require('path');
const webpack = require('webpack');
const packageInfo = require('../package');
const srcPath = path.resolve(__dirname, '../src');

module.exports = {
  plugins: [
    // your custom plugins
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(packageInfo.version),
      __THEME__: JSON.stringify('index')
    }),
  ],
  module: {
    rules: [
      // add your custom rules.
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)((\?|#).*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: './',
          },
        }],
      },
      {
        test: /\.(ts|tsx)$/,
        use: ['awesome-typescript-loader'],
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      // '@alicloud/cloud-charts': srcPath,
      '@alife/aisc-widgets': srcPath,
      // '@alife/aisc-widgets/lib': srcPath,
      // '@antv/data-set$': path.resolve(__dirname, '../components/common/dataSet'),
      // '@antv/data-set/lib': '@antv/data-set/lib'
    }
  },
};
