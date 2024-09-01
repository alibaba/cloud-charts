const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
// const Config = require('webpack-chain');
const { getWebpackConfig } = require('build-scripts-config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const packageInfo = require('./package.json');

/** 自定义构建脚本 - 后置 */
module.exports = ({ context, onGetWebpackConfig, registerTask, registerCliOption }) => {
  const { command, commandArgs, rootDir, userConfig } = context;
  const { library, libraryTarget = 'umd', libraryExport } = userConfig;

  function setBuildConfig(config, theme = 'index') {
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
        __THEME__: JSON.stringify(theme),
      }]);

    // 插件部分，需要 externals @alicloud/cloud-charts 本身
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
      '@alicloud/cloud-charts': {
        root: userConfig.library,
        commonjs2: '@alicloud/cloud-charts',
        commonjs: '@alicloud/cloud-charts',
        amd: '@alicloud/cloud-charts'
      },
    });

    if (commandArgs.development) {
      config.optimization.minimize(false);
      config.output
        .path(path.resolve(rootDir, 'buildDev'))
        .filename('[name].dev.js')
        .publicPath('./buildDev/')
        .libraryExport('default')
    }
  }

  registerCliOption({
    name: 'online',
    commands: ['start'],
  });

  registerCliOption({
    name: 'analyzer',
    commands: ['build'],
  });

  registerCliOption({
    name: 'production',
    commands: ['build'],
  });

  registerCliOption({
    name: 'development',
    commands: ['build'],
  });

  // 在线代理
  if (commandArgs.online) {
    const onlineConfig = getWebpackConfig('development');
    onlineConfig.target('web');
    onlineConfig.context(rootDir);

    setBuildConfig(onlineConfig);

    onlineConfig.output
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
  if (!commandArgs.analyzer) {
    const mode = command === 'start' ? 'development' : 'production';
    const pluginsConfig = getWebpackConfig(mode);
    pluginsConfig.target('web');
    pluginsConfig.context(rootDir);

    setBuildConfig(pluginsConfig);

    pluginsConfig.output
      .library(`${library}[name]`)
      .libraryExport('default')
      .libraryTarget(libraryTarget);

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
  }

  onGetWebpackConfig(config => {
    if (commandArgs.production) {
      config.module
        .rule('tsx')
        .test(/\.tsx?$/)
        .before('babel-loader')
        .use('custom-loader')
        .loader(path.resolve('./loader/teamix-debugger-loader.js'))
        .end()
    }
  });

  // 调整 umd 包 webpack 配置
  // config 为 webpack-chain 实例
  onGetWebpackConfig('component-dist', config => {
    setBuildConfig(config);

    if (commandArgs.analyzer) {
      config
        .plugin('analyzer')
        .use(BundleAnalyzerPlugin);
    }
  });

  // onGetWebpackConfig(config => {
  //   console.log(Config.toString(config.toConfig()));
  // });

  // 主题包
  if (!commandArgs.online && !commandArgs.analyzer) {
    const themeConfig = getWebpackConfig('production');
    themeConfig.target('web');
    themeConfig.context(rootDir);

    setBuildConfig(themeConfig, 'dark');

    themeConfig.module.rule('scss').use('sass-loader').tap(options => {
      return {
        ...options,
        // additionalData: (content, loaderContext) => {
        //   // More information about available properties https://webpack.js.org/api/loaders/
        //   const { resourcePath, rootContext } = loaderContext;
        //   const relativePath = path.relative(rootContext, resourcePath);
        //   console.log('relativePath', relativePath);
        //   return content;
        //   // if (relativePath === "styles/foo.scss") {
        //   //   return "$value: 100px;" + content;
        //   // }
        //   //
        //   // return "$value: 200px;" + content;
        // },
        // 由于 build-plugin-component -> build-scripts-config -> sass-loader 版本是 8.x，所以使用 prependData。
        // 如果更新了依赖版本，可以用 additionalData
        // prependData: (loaderContext) => {
        additionalData: (content, loaderContext) => {
          // More information about available properties https://webpack.js.org/api/loaders/
          const { resourcePath, rootContext } = loaderContext;
          // const relativePath = path.relative(rootContext, resourcePath);

          const themePath = path.relative(resourcePath, path.join(rootContext, './src/themes/dark.scss'));
          // console.log('relativePath', relativePath, resourcePath);
          // if (relativePath === 'src/index.scss') {
          //   return '@import "themes/dark";'
          // }
          return `@import "${themePath.slice(3)}"; `;
        },
      }
    })

    themeConfig.output
      .library(library)
      .libraryExport(libraryExport)
      .libraryTarget(libraryTarget);

    themeConfig
      .entry('dark')
      .add(path.resolve(rootDir, 'src/index.scss'))
      .add(path.resolve(rootDir, 'src/index.ts'));

    registerTask('theme-dark', themeConfig);
  }
};
