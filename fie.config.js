/**
 * Copyright(c) Alibaba Group Holding Limited.
 *
 * Authors:
 *   云朔 <yunshuo.zk@alibaba-inc.com>>
 */
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
        return config;
    }
  }
};
