/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   云朔 <yunshuo.zk@alibaba-inc.com>>
 */
const customWebpackConfig = require('./webpack.config');
module.exports = {
  toolkit: 'fie-toolkit-docs',
  toolkitConfig: {
    //fie start时打开本地服务器的端口号
    port: 9000,
    //fie start时，是否自动打开浏览器
    open: true,
    //文件改变时是否自动刷新页面
    liveload: false,
    //
    webpackConfig(config){
      const alias = config.resolve.alias;
      const srcPath = customWebpackConfig.srcPath;

      alias['@alife/p2widgets'] = srcPath;
      alias['@alife/p2widgets/lib'] = srcPath;
      return config;
    }
  },
  tasks: {
    build2: [
      {
        // 同步版本号
        command: 'fie git sync'
      },
      {
        // 检测dependencies中的版本依赖
        command: 'fie check'
      },
      {
        // console检测
        command: 'fie console detect --force'
      },
      {
        // 执行一下 gulp的build任务
        command: 'node_modules/.bin/gulp build'
      }
    ],

    publish: [
      {
        // 生成history.md 文件
        command: 'fie commit out'
      },
      // {
      //   // 调用套件中的发布命令
      //   command: '__toolkitCommand__'
      // },
      // {
      //   // 将demo目录发布至demo平台
      //   command: 'fie git publishDemo'
      // }
    ]
  },

  // ci 插件所需的配置
  ci: {
    // 返回项目中的webpack配置
    getWebpackConfig() {
      return customWebpackConfig.dev();
    }
  }
};
