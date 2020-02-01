'use strict';

const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const babel = require('gulp-babel');
const rename = require("gulp-rename");
const del = require('del');
const open = require('open');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const srcPath = 'components';
const outputPath = 'build';

const defaultTheme = 'normal';

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
      open(`http://localhost:${port}/demo/index.html`);
    } else {
      gutil.log('building success!');
    }
  });
});

gulp.task('build:dist', ['build:plugins'], (cb) => {
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

gulp.task('build:lib', ['clean'], () => {
  gulp.src([srcPath + '/**/*.less', srcPath + '/**/*.scss', srcPath + '/**/*.json'])
  // .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('lib'));

  return gulp.src(srcPath + '/**/*.js?(x)')
    .pipe(babel({
        babelrc: false,
        "presets": [
          [
            "@ali/babel-preset-fusion",
            {
              // modules: true
            }
          ]
        ],
        "plugins": []
      }
    ))
    .pipe(gulp.dest('lib'));
});


// const theme = 'dark';
//
// gulp.task('build:themeFile', ['build:dist', 'build:lib'], (cb) => {
//   // 备份原始文件
//   gulp.src([srcPath + `/theme/**.js`, srcPath + `/theme/**.scss`])
//     .pipe(gulp.dest('__temp'))
//     .on('end', () => {
//
//       // 设置主题文件
//       gulp.src([srcPath + `/theme/${theme}.js`, srcPath + `/theme/${theme}.scss`])
//         .pipe(rename({
//           basename: defaultTheme
//         }))
//         .pipe(gulp.dest(srcPath + '/theme/'))
//         .on('end', cb);
//     });
// });

const themeList = ['dark', 'aone', 'aliyun', 'aliyun-dark'];

// 生成主题对应任务
themeList.forEach((theme, index) => {
  const preTask = [];
  for (let i = 0; i < themeList.length; i++) {
    if (i < index) {
      preTask.push(`build:theme:${themeList[i]}`);
    }
  }

  gulp.task(`build:theme:${theme}`, preTask, (cb) => {
    // // 设置主题文件
    // gulp.src([srcPath + `/theme/${theme}.js`, srcPath + `/theme/${theme}.scss`])
    //   .pipe(rename({
    //     basename: defaultTheme
    //   }))
    //   .pipe(gulp.dest(srcPath + '/theme/'))
    //   .on('end', () => {
        // 编译主题
        const webpackConfig = config.prod(theme);
        delete webpackConfig.port;
        webpack(webpackConfig, (err, stats) => {
          if (err || stats.hasErrors()) {
            gutil.log(err);
          }
          gutil.log(`编译主题： ${theme}`);
          cb && cb();
        });
  //     });
  });
});

// // 备份原始文件
// gulp.task('build:themeBak', ['build:dist', 'build:lib'], (cb) => {
//   gulp.src([srcPath + `/theme/**.js`, srcPath + `/theme/**.scss`])
//     .pipe(gulp.dest('__temp'))
//     .on('end', cb);
// });

gulp.task('build:theme', themeList.map(theme => `build:theme:${theme}`), (cb) => {
  cb && cb();
  // //返回备份档
  // del(srcPath + '/theme').then(() => {
  //   gulp.src('__temp/*')
  //     .pipe(gulp.dest(srcPath + '/theme'))
  //     .on('end', () => {
  //       // 清空备份
  //       del('__temp').then(() => {
  //         cb && cb();
  //       });
  //     });
  // });
});

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
gulp.task('build', ['build:dist', 'build:lib', 'build:theme']);

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
