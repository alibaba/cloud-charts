const path = require('path');
const webpack = require('webpack');
// const Config = require('webpack-chain');
const { getWebpackConfig } = require('build-scripts-config');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const packageInfo = require('./package.json');

/** 自定义构建脚本 - 后置 */
module.exports = ({ context, onGetWebpackConfig, registerTask, registerCliOption, modifyUserConfig }) => {
  const { command, commandArgs, rootDir, userConfig } = context;

  registerCliOption({
    name: 'online',
    commands: ['start'],
  });

  registerCliOption({
    name: 'analyzer',
    commands: ['build'],
  });

  if (commandArgs.online) {
    const { library, libraryTarget = 'umd', libraryExport } = userConfig;
    const onlineConfig = getWebpackConfig('development');
    onlineConfig.target('web');
    onlineConfig.context(rootDir);

    onlineConfig.output
      // .path(path.resolve(rootDir, 'build'))
      // .filename('[name].js')
      // .publicPath('/build/')
      .library(library)
      .libraryExport(libraryExport)
      .libraryTarget(libraryTarget);

    registerTask('online-web', onlineConfig);
  }

  // 调整 webpack 配置
  // config 为 webpack-chain 实例
  onGetWebpackConfig(config => {

    if (command === 'build'|| commandArgs.online) {
      // 调整构建目录
      config.output
        .path(path.resolve(rootDir, 'build'))
        .filename('[name].js')
        .publicPath('./build/')

      // 去除默认字体资源配置
      config.module.rules
        .delete('woff2')
        .delete('ttf')
        .delete('eot')
        .delete('svg');

      // 自定义字体资源配置
      config.module
        .rule('font').test(/\.(woff|woff2|eot|ttf|otf|svg)((\?|#).*)?$/)
        .use('file').loader('file-loader').options({
          name: '[name].[ext]',
          publicPath: './',
        });

      // 全局变量
      config
        .plugin('DefinePlugin')
        .use(webpack.DefinePlugin, [{
          __VERSION__: JSON.stringify(packageInfo.version),
          __THEME__: JSON.stringify('index'),
        }]);
    }

    // if (command === 'start') {
    //   // 添加 demo 用的快捷链接
    //   config.resolve.alias.set('@component', filePath);
    // }
    if (command === 'build' || commandArgs.online) {
      // config.externals({
      //   react: 'var React',
      //   'react-dom': 'var ReactDOM',
      //   '@alife/aisc-widgets': 'var AiscWidgets',
      //   three: 'var THREE',
      //   'lottie-web': 'var lottie',
      //   lodash: 'var _',
      // });

    }

    if (command === 'build' && commandArgs.analyzer) {
      // config
      //   .plugin('analyzer')
      //   .use(BundleAnalyzerPlugin);
    }

    // console.log(Config.toString(config.toConfig()));
  });
};
