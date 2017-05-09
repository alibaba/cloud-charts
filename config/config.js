const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fieConfig = require('../fie.config.js');
const toolkitConfig = fieConfig['toolkitConfig'];
const package = require('../package.json');
const routerCof = require('../site/theme/index')

function pickerGenerator(module) {
  const tester = new RegExp(`^${module}`);
  return (markdownData) => {
    const filename = markdownData.meta.filename;
    if (tester.test(filename) && !/\/demo$/.test(path.dirname(filename))) {
      return {
        meta: markdownData.meta,
      };
    }
  };
}

function getPick(source) {
  var obj = {
    components(markdownData) {
      const filename = markdownData.meta.filename;
      if (!/^components/.test(filename) ||
        /\/demo$/.test(path.dirname(filename))) return;
      return {
        meta: markdownData.meta,
      };
    }
  };
  for (var key in source) {
    if (key != "components") {
      obj[key] = pickerGenerator(key);
    }
  }
  return obj;
}
module.exports = function (output, root) {
  var webpackConfig = toolkitConfig.webpackConfig;

  return {
    port: toolkitConfig.port || 9000,
    source: routerCof.source,
    root: root,
    output: output,
    version: package.version + Math.floor(Math.random() * 100),
    lazyLoad(nodePath, nodeValue) {
      if (typeof nodeValue === 'string') {
        return true;
      }
      return nodePath.endsWith('/demo');
    },
    pick: getPick(routerCof.source),
    theme: './site/theme',
    htmlTemplate: './site/theme/static/template.html',
    plugins: [],
    doraConfig: {
      verbose: true,
      plugins: ['dora-plugin-upload'],
    },
    webpackConfig(config) {
      config.resolve.alias = {
        site: path.join(process.cwd(), 'site'),
        'react-router': 'react-router/umd/ReactRouter',
      };

      config.babel.plugins.push([
        require.resolve('babel-plugin-transform-runtime'),
        {
          polyfill: false,
          regenerator: true,
        },
      ]);

      config.module.loaders.push({
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'raw!postcss!@ali/sass-loader')
      });

      config.plugins.push(new ExtractTextPlugin('[name].css'));


      config.externals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@alife/aisc': 'var Aisc'
      }

      config = webpackConfig(config);

      return config;
    }
  };
}