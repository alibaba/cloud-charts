module.exports = {
    // 组件所使用的FIE toolkit
  toolkitName: 'fie-toolkit-alife',

  tasks: {
    start: [
      {
                // 将当前目录链接到fie 本地cdn目录
        command: 'fie link'
      },
      {
        command: 'node_modules/.bin/gulp start'
      }
    ],

    build: [
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
      {
                // 调用套件中的发布命令
        command: '__toolkitCommand__'
      },
      {
                // 将demo目录发布至demo平台
        command: 'fie git publishDemo'
      }
    ],

    open: [
      {
                // 打开gitlab上的项目
        command: 'fie git open'
      }
    ]
  },

    // ci 插件所需的配置
  ci: {
        // 返回项目中的webpack配置
    getWebpackConfig() {
      return require('./webpack.config').dev();
    }
  }
};
