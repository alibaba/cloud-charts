const path = require('path');
const webpack = require('webpack');
const packageInfo = require('../package');
const srcPath = path.resolve(__dirname, '../src');

module.exports = {
  "stories": [
    '../stories/*.stories.@(js|jsx|ts|tsx)'
    // "../src/**/*.stories.mdx",
    // "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials"
  ],
  "framework": "@storybook/react",
  // babel: async (options) => {
  //   // ...options,
  //   console.log('babel', options);
  //   // any extra options you want to set
  //   return options;
  // },
  webpackFinal: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageInfo.version),
        __THEME__: JSON.stringify('index')
      }),
    );

    config.module.rules.push(
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
    );

    if (config.resolve.alias) {
      config.resolve.alias['@alife/aisc-widgets'] = srcPath;
    } else {
      config.resolve.alias = {
        '@alife/aisc-widgets': srcPath,
      };
    }

    return config;
  },
}
