'use strict';

const path = require('path');
const fs = require('fs');
const glob = require('glob');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const sass = require('gulp-sass');
const del = require('del');
const WebpackDevServer = require('webpack-dev-server');
const sassExtract = require('sass-extract');
const createSassExtractJsPlugin = require('./sass-extract-js/plugin');
const sassExtractJsPlugin = createSassExtractJsPlugin({ camelCase: false, hex: true });
const packageInfo = require('./package');
const config = require('./webpack.config');
const srcPath = 'components';
const outputPath = 'build';

gulp.task('clean', (cb) => {
  del(['build', 'lib']).then(() => {
    cb();
  });
});

gulp.task('start', (cb) => {
  let buildFirstTime = true;
  const webpackConfig = config.dev();
  const port = webpackConfig.port;
  delete webpackConfig.port;
  const compiler = webpack(webpackConfig);

  new WebpackDevServer(compiler, {
    hot: true,
    inline: true,
    // stats: { colors: true },
    quiet: true,
    publicPath: webpackConfig.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    contentBase: path.resolve(__dirname, './')
  }).listen(port, '0.0.0.0', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }

    // 只有第一次启动start的时候才执行
    if (buildFirstTime) {
      buildFirstTime = false;
      cb && cb();
      // listening
      gutil.log('[webpack-dev-server]', gutil.colors.magenta(`http://localhost:${port}`));
      gutil.log('[webpack-dev-server]', 'To stop service, press [Ctrl + C] ..');
    } else {
      gutil.log('building success!');
    }
  });
});

gulp.task('build:theme-sass', (cb) => {
  const nodeModulesPath = path.resolve(__dirname, 'node_modules');
  glob.sync(`${srcPath}/themes/*.scss`).forEach((item) => {
    if (item.indexOf('index.scss') > -1 || item.indexOf('base.scss') > -1) {
      return;
    }
    gutil.log(item);
    const rendered = sassExtract.renderSync({
      file: item
    }, {
      plugins: [sassExtractJsPlugin]
    });

    fs.writeFileSync('./' + item.replace(/\.scss$/, '.style.js'), `export default ${JSON.stringify(rendered.vars)};`);
  });

  cb && cb()
});

gulp.task('build:dist', ['build:plugins', 'build:theme-sass'], (cb) => {
  const webpackConfig = config.prod();
  delete webpackConfig.port;
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      gutil.log(err);
    }

    gutil.log(stats.toString({
      colors: true,
      chunks: true,
      modulesSort: 'size'
    }));

    cb && cb();
  });
});

gulp.task('css', ['clean'], () => {
  return gulp.src([`${srcPath}/**/*.scss`, `!${srcPath}/themes/*.scss`, '!**/variable.scss', '!**/mixin.scss', '!**/function.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('lib'));
});

gulp.task('build:lib', ['clean', 'css'], () => {
  gulp.src([
    // srcPath + '/**/*.less',
    srcPath + '/**/*.scss',
    srcPath + '/**/*.json',
    srcPath + '/**/*.woff',
    srcPath + '/**/*.woff2',
    srcPath + '/**/*.eot',
    srcPath + '/**/*.ttf',
    srcPath + '/**/*.otf',
    srcPath + '/**/*.svg',
  ])
  // .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('lib'));

  return gulp.src(srcPath + '/**/*.js?(x)')
    .pipe(replace('__VERSION__', JSON.stringify(packageInfo.version)))
    .pipe(replace('__THEME__', JSON.stringify('index')))
    .pipe(replace(/import '(.+?)\.scss';/, 'import \'$1.css\''))
    .pipe(babel({
        babelrc: false,
        "presets": [
          "babel-preset-react",
          ["babel-preset-env", { "loose": true }],
          "babel-preset-stage-0"
        ],
        "plugins": [
          "babel-plugin-transform-react-es6-displayname",
          "babel-plugin-transform-object-assign",
          "babel-plugin-transform-proto-to-assign"
        ]
      }
    ))
    .pipe(gulp.dest('lib'));
});

// const themeList = ['dark'];
//
// // 生成主题对应任务
// themeList.forEach((theme, index) => {
//   const preTask = ['build:plugins', 'build:theme-sass'];
//   for (let i = 0; i < themeList.length; i++) {
//     if (i < index) {
//       preTask.push(`build:theme:${themeList[i]}`);
//     }
//   }
//
//   gulp.task(`build:theme:${theme}`, preTask, (cb) => {
//     // 编译主题
//     const webpackConfig = config.prod(theme);
//     delete webpackConfig.port;
//     webpack(webpackConfig, (err, stats) => {
//       if (err || stats.hasErrors()) {
//         gutil.log(err);
//       }
//       gutil.log(`编译主题： ${theme}`);
//       cb && cb();
//     });
//   });
// });
//
// gulp.task('build:theme', themeList.map(theme => `build:theme:${theme}`), (cb) => {
//   cb && cb();
// });

gulp.task('build:plugins', ['clean'], (cb) => {
  const webpackConfig = config.prod(undefined, true);
  delete webpackConfig.port;
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      gutil.log(err);
    }

    gutil.log(stats.toString({
      colors: true,
      chunks: true,
      modulesSort: 'size'
    }));

    // 不会直接重命名，只能用笨方法
    gulp.src([outputPath + `/*.js`, srcPath + `/*.css`])
      .pipe(rename(function (path) {
        path.basename = path.basename.toLowerCase();
      }))
      .pipe(gulp.dest('__plugins/'))
      .on('end', () => {
        del([outputPath + `/*.js`, srcPath + `/*.css`]).then(() => {
          gulp.src('__plugins/*')
            .pipe(gulp.dest(outputPath + '/'))
            .on('end', () => {
              // 清空备份
              del('__plugins').then(() => {
                cb && cb();
              });
            });
        });
      });
  });
});

gulp.task('default', ['start']);
// gulp.task('build', ['build:dist', 'build:lib', 'build:demo']);
gulp.task('build', ['build:plugins', 'build:theme-sass', 'build:dist', 'build:lib']);

gulp.task('online', (cb) => {
  let buildFirstTime = true;
  const webpackConfig = config.online(undefined, false);
  const port = webpackConfig.port;
  delete webpackConfig.port;
  const compiler = webpack(webpackConfig);

  new WebpackDevServer(compiler, {
    hot: true,
    inline: true,
    // stats: { colors: true },
    quiet: true,
    publicPath: webpackConfig.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    contentBase: path.resolve(__dirname, './')
  }).listen(port, '0.0.0.0', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }

    // 只有第一次启动start的时候才执行
    if (buildFirstTime) {
      buildFirstTime = false;
      cb && cb();
      // listening
      gutil.log('[webpack-dev-server]', gutil.colors.magenta(`http://localhost:${port}`));
      gutil.log('[webpack-dev-server]', 'To stop service, press [Ctrl + C] ..');
    } else {
      gutil.log('building success!');
    }
  });
});
