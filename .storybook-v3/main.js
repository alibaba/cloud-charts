const path = require('path');
const webpack = require('webpack');
const packageInfo = require('../package');
const srcPath = path.resolve(__dirname, '../src');
const chartsPath = path.resolve(__dirname, '../packages/charts');
const corePath = path.resolve(__dirname, '../packages/core/src');
const g2v5Umd = path.resolve(__dirname, '../packages/core/node_modules/@antv/g2/dist/g2.min.js');
const packagesRoot = path.resolve(__dirname, '../packages');

// v3 新架构验收 storybook：
// - 老组件（@alicloud/cloud-charts → src/，G2 v4）原样可跑
// - 新包（packages/core、packages/charts/*，G2 v5）通过 alias 指向工作区源码
// - G2 版本隔离：
//   src/ → 根 node_modules/@antv/g2@4.2.10（v4 ESM，webpack 正常解析）
//   packages/ → G2 v5 UMD（webpack 4 不支持 exports 字段，用 UMD 绕过）
//   @antv/util 同理：根=2.0.17（v4），packages/core 嵌套=3.3.11（v5）
module.exports = {
  stories: ['../stories-v3/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react',
  webpackFinal: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(packageInfo.version),
        __THEME__: JSON.stringify('index'),
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
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: './',
            },
          },
        ],
      },
    );

    // 老组件：非精确 alias（与 .storybook/main.js 一致）
    // v3 包：精确 alias（$ 后缀），指向工作区源码
    config.resolve.alias = {
      ...config.resolve.alias,
      '@alicloud/cloud-charts': srcPath,
      '@alicloud/cloud-charts-core$': corePath,
      '@alicloud/cloud-charts-bar$': path.resolve(chartsPath, 'wbar/src'),
      '@alicloud/cloud-charts-box$': path.resolve(chartsPath, 'wbox/src'),
      '@alicloud/cloud-charts-candlestick$': path.resolve(chartsPath, 'wcandlestick/src'),
      '@alicloud/cloud-charts-funnel$': path.resolve(chartsPath, 'wfunnel/src'),
      '@alicloud/cloud-charts-heatmap$': path.resolve(chartsPath, 'wheatmap/src'),
      '@alicloud/cloud-charts-hexagonal$': path.resolve(chartsPath, 'whexagonal/src'),
      '@alicloud/cloud-charts-hierarchy$': path.resolve(chartsPath, 'whierarchy/src'),
      '@alicloud/cloud-charts-histogram$': path.resolve(chartsPath, 'whistogram/src'),
      '@alicloud/cloud-charts-line$': path.resolve(chartsPath, 'wline/src'),
      '@alicloud/cloud-charts-linebar$': path.resolve(chartsPath, 'wlinebar/src'),
      '@alicloud/cloud-charts-linebox$': path.resolve(chartsPath, 'wlinebox/src'),
      '@alicloud/cloud-charts-linescatter$': path.resolve(chartsPath, 'wlinescatter/src'),
      '@alicloud/cloud-charts-map$': path.resolve(chartsPath, 'wmap/src'),
      '@alicloud/cloud-charts-miniline$': path.resolve(chartsPath, 'wminiline/src'),
      '@alicloud/cloud-charts-multicircle$': path.resolve(chartsPath, 'wmulticircle/src'),
      '@alicloud/cloud-charts-nightingale$': path.resolve(chartsPath, 'wnightingale/src'),
      '@alicloud/cloud-charts-pie$': path.resolve(chartsPath, 'wpie/src'),
      '@alicloud/cloud-charts-radar$': path.resolve(chartsPath, 'wradar/src'),
      '@alicloud/cloud-charts-rectangle$': path.resolve(chartsPath, 'wrectangle/src'),
      '@alicloud/cloud-charts-sankey$': path.resolve(chartsPath, 'wsankey/src'),
      '@alicloud/cloud-charts-scatter$': path.resolve(chartsPath, 'wscatter/src'),
      '@alicloud/cloud-charts-sunburst$': path.resolve(chartsPath, 'wsunburst/src'),
      '@alicloud/cloud-charts-treemap$': path.resolve(chartsPath, 'wtreemap/src'),
    };

    if (!config.resolve.extensions.includes('.ts')) {
      config.resolve.extensions.push('.ts', '.tsx');
    }

    // G2 v5 的 package.json 使用 exports 字段，webpack 4 不支持。
    // 对 packages/ 目录下的 @antv/g2 精确引用重定向到 G2 v5 UMD 构建。
    // 老代码（src/）使用 @antv/g2/esm/* 子路径引用，不受此插件影响，仍解析到根 v4。
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^@antv\/g2$/,
        (resource) => {
          if (resource.context && resource.context.startsWith(packagesRoot)) {
            resource.request = g2v5Umd;
          }
        },
      ),
    );

    return config;
  },
};
