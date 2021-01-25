const path = require('path');
const fs = require('fs');
const glob = require('glob');
const sass = require('node-sass');
const sassExtract = require('sass-extract');
const createSassExtractJsPlugin = require('./sass-extract-js/plugin');
const sassExtractJsPlugin = createSassExtractJsPlugin({ camelCase: false, hex: true });
const packageInfo = require('./package.json');

/** 自定义构建脚本 - 前置 */
module.exports = ({ context, log, modifyUserConfig, onHook }) => {
  const { command, rootDir } = context;
  // 编译 主题包scss变量 到 [theme].style.js
  const themePath = path.resolve(rootDir, 'src/themes');
  fs.readdirSync(themePath).forEach((theme) => {
    if (/\w+.scss$/.test(theme) && theme !== 'base.scss' && theme !== 'index.scss') {
      const rendered = sassExtract.renderSync({
        file: themePath + '/' + theme,
      }, {
        plugins: [sassExtractJsPlugin]
      });

      fs.writeFileSync(themePath + '/' + theme.replace(/\.scss$/, '.style.ts'), `export default ${JSON.stringify(rendered.vars)};`);

      log.info(`build theme: ${theme}`);
    }
  });

  if (command === 'build') {
    const tempCssFile = [];
    const scssFile = glob.sync(
      `${rootDir}/src/**/index.scss`
    );
    // 额外增加 cdn.scss
    scssFile.push(`${rootDir}/src/cdn.scss`);
    scssFile.push(`${rootDir}/src/Wicon/cdn.scss`);

    scssFile.forEach((item, i) => {
        if (item.indexOf('themes/index.scss') > -1) {
          return;
        }
        const rendered = sass.renderSync({
          file: item
        });
        const cssFileName = item.replace(/\.scss$/, '.css');
        fs.writeFileSync(cssFileName, rendered.css);
        tempCssFile.push(cssFileName);
        log.info(`scss to css: ${item}`);
      });

    // 构建后清除 css 文件
    onHook('after.build.compile', () => {
      tempCssFile.forEach((file) => {
        fs.unlinkSync(file);
        log.info(`clean css: ${file}`);
      });

      log.info('构建完成');
    });
  }

  const myBabelPlugins = [
    ["babel-plugin-transform-define", {
      __VERSION__: packageInfo.version,
      __THEME__: 'index',
    }],
  ];

  if (command === 'build') {
    myBabelPlugins.push(
      ["babel-plugin-transform-rename-import", {
        replacements: [
          { original: '^(.+?)\\.scss$', replacement: '$1.css' },
        ],
      }]
    );
  }

  // 自定义babel插件
  modifyUserConfig('babelPlugins', myBabelPlugins);

};
