const packageInfo = require('./package.json');

/** 自定义构建脚本 - 前置 */
module.exports = ({ modifyUserConfig }) => {

  // 自定义babel插件
  modifyUserConfig('babelPlugins', [
    ["babel-plugin-transform-define", {
      __VERSION__: packageInfo.version,
      __THEME__: 'index',
    }]
  ]);

};
