---
order: 0
title: 环境搭建
type: 规范
---

## Step:1 基础环境

### 安装 Node.js（如已安装请跳过）

下载并安装最新 LTS 版本的 Node.js，安装完成后你将能够在命令行使用 node 和 npm 两个命令。 推荐安装 4.6.x - LTS版本的Node。

### [下载地址](https://nodejs.org/en/download/)

使用 tnpm 加速 npm

tnpm是阿里内部的包管理工具。tnpm 支持 scoped 私有模块， 请务必安装 tnpm 来安装内网模块。安装方式如下：

`
$ npm install tnpm@release-4 -g --registry=http://registry.npm.alibaba-inc.com
`

fie 是工程化思想下的前端脚手架工具，提供统一的集成环境，提高开发效率。 使用 tnpm 安装 fie：

`$ tnpm install fie -g`

fie-toolkit-ais-multi 是专门为AIS前端业务定制化的多页应用、涵盖前端环境自动搭建、模板页面生成、AISC组件使用、接口调用等功能，使用 fie ：

`fie install fie-toolkit-ais-multi`


# Step:2 初始化项目

初始化

`fie init ais-multi`

开启本地服务

`fie start`

添加模块

`fie add page xxx # 添加名为 xxx 的页面`

代码打包

`fie build `

# Step:3 使用组件

AISC是一套基于 React 的前端解决方案、定制化的为AIS自身业务提供前端基础组件、业务组件、组件使用参考事例demo。
[AISC官网地址](http://aisc.alibaba.net/#/components)

### 参考资料：
- [NodeJS阿里手册](https://lark.alipay.com/alinode/handbook/env)
- [NodeJS官网](https://nodejs.org/en/)
- [NPM官网](https://www.npmjs.org/)
- [FIE](http://fie.alibaba-inc.com/)
- [AISC官网地址](http://aisc.alibaba.net/#/components)

