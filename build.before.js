const path = require('path');
const fs = require('fs');
const sassExtract = require('sass-extract');
const createSassExtractJsPlugin = require('./sass-extract-js/plugin');
const sassExtractJsPlugin = createSassExtractJsPlugin({ camelCase: false, hex: true });
const packageInfo = require('./package.json');

/** 自定义构建脚本 - 前置 */
module.exports = ({ context, log, modifyUserConfig }) => {
  const { rootDir } = context;
  // 编译 主题包scss变量 到 [theme].style.js
  const themePath = path.resolve(rootDir, 'src/themes');
  fs.readdirSync(themePath).forEach((theme) => {
    if (/\w+.scss$/.test(theme) && theme !== 'base.scss' && theme !== 'index.scss') {
      const rendered = sassExtract.renderSync({
        file: themePath + '/' + theme,
      }, {
        plugins: [sassExtractJsPlugin]
      });

      fs.writeFileSync(themePath + '/' + theme.replace(/\.scss$/, '.style.js'), `export default ${JSON.stringify(rendered.vars)};`);

      log.info(`build theme: ${theme}`);
    }
  });

  // 自定义babel插件
  modifyUserConfig('babelPlugins', [
    ["babel-plugin-transform-define", {
      __VERSION__: packageInfo.version,
      __THEME__: 'index',
    }]
  ]);

};
