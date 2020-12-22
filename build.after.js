const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const Config = require('webpack-chain');
const { getWebpackConfig } = require('build-scripts-config');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const packageInfo = require('./package.json');

/** 自定义构建脚本 - 后置 */
module.exports = ({ context, onGetWebpackConfig, registerTask, registerCliOption }) => {
  const { command, commandArgs, rootDir, userConfig } = context;
  const { library, libraryTarget = 'umd', libraryExport } = userConfig;

  registerCliOption({
    name: 'online',
    commands: ['start'],
  });

  registerCliOption({
    name: 'analyzer',
    commands: ['build'],
  });

  if (commandArgs.online) {
    const onlineConfig = getWebpackConfig('development');
    onlineConfig.target('web');
    onlineConfig.context(rootDir);

    onlineConfig.output
      .path(path.resolve(rootDir, 'build'))
      .filename('[name].js')
      .publicPath('/build/')
      .library(library)
      .libraryExport(libraryExport)
      .libraryTarget(libraryTarget);

    onlineConfig
      .entry('index')
        .add(path.resolve(rootDir, 'src/index.scss'))
        .add(path.resolve(rootDir, 'src/index.ts'));

    registerTask('online-web', onlineConfig);
  }

  // 插件部分
  const mode = command === 'start' ? 'development' : 'production';
  const pluginsConfig = getWebpackConfig(mode);
  pluginsConfig.target('web');
  pluginsConfig.context(rootDir);
  pluginsConfig.output
    .library(`${library}[name]`)
    .libraryExport(libraryExport)
    .libraryTarget(libraryTarget);

  // 插件部分
  const pluginPath = path.resolve(rootDir, './src/plugins');
  const plugins = fs.readdirSync(pluginPath);
  plugins.forEach(function (plugin) {
    var componentStat = fs.lstatSync(pluginPath + '/' + plugin);
    if (!componentStat.isDirectory()) {
      return;
    }

    pluginsConfig
      .entry(plugin)
      .add('./src/plugins/' + plugin + '/index.tsx');
  });

  registerTask('plugins', pluginsConfig);

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

      // 插件部分，需要 externals @alife/aisc-widgets 本身
      config.externals({
        react: {
          root: 'React',
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react',
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs: 'react-dom',
          commonjs2: 'react-dom',
          amd: 'react-dom',
        },
        '@alife/aisc-widgets': {
          root: userConfig.library,
          commonjs2: '@alife/aisc-widgets',
          commonjs: '@alife/aisc-widgets',
          amd: '@alife/aisc-widgets'
        },
      });
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

    console.log(Config.toString(config.toConfig()));
  });
};