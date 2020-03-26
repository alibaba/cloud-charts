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
const del = require('del');
const open = require('open');
const WebpackDevServer = require('webpack-dev-server');
const sassExtract = require('sass-extract');
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
      open(`http://localhost:${port}/demo/index.html`);
    } else {
      gutil.log('building success!');
    }
  });
});

gulp.task('build:theme-sass', (cb) => {
  const nodeModulesPath = path.resolve(__dirname, 'node_modules');
  glob.sync(`${srcPath}/theme/*.scss`).forEach((item) => {
    if (item.indexOf('index.scss') > -1) {
      return;
    }
    gutil.log(item);
    // 读取对应的文件，并将 ~ 替换到 node_modules
    const file = fs
      .readFileSync(item, {
        encoding: 'utf-8'
      })
      .replace('~@alife', './@alife');

    // 改为传入替换后的字符串编译
    const rendered = sassExtract.renderSync({
      data: file,
      includePaths: [
        nodeModulesPath
      ],
    }, {
      plugins: [{ plugin: 'sass-extract-js', options: { camelCase: false } }]
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

gulp.task('build:lib', ['clean'], () => {
  gulp.src([
    srcPath + '/**/*.less',
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
    .pipe(replace('__THEME__', JSON.stringify('normal')))
    .pipe(babel({
        babelrc: false,
        "presets": [
          [
            "@ali/babel-preset-fusion",
            {
              modules: false
            }
          ]
        ],
        "plugins": []
      }
    ))
    .pipe(gulp.dest('lib'));
});

const themeList = ['dark', 'aone', 'aliyun', 'aliyun-dark'];

// 生成主题对应任务
themeList.forEach((theme, index) => {
  const preTask = ['build:plugins', 'build:theme-sass'];
  for (let i = 0; i < themeList.length; i++) {
    if (i < index) {
      preTask.push(`build:theme:${themeList[i]}`);
    }
  }

  gulp.task(`build:theme:${theme}`, preTask, (cb) => {
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
  });
});

gulp.task('build:theme', themeList.map(theme => `build:theme:${theme}`), (cb) => {
  cb && cb();
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
gulp.task('build', ['build:plugins', 'build:theme-sass', 'build:dist', 'build:lib', 'build:theme']);

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
