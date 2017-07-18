---
order: 0
title: widgets使用
type: 规范
---

## 安装

本组件库是aisc组件库的拓展，主要为了更多的可视化场景。

```
// 在项目根目录执行
tnpm install @alife/aisc-widgets --save
```

# 入门使用

在脚手架的页面内引入下面的内容:(ReactDOM.render内的内容需要放到页面实际的render方法中)

```jsx
// 页面内引用
import {
  Wcontainer, Wicon, Wnumber
} from '@alife/aisc-widgets';


ReactDOM.render(
  <Wcontainer title={false} height={86}>
    <Wnumber bottomTitle="CPU" >1</Wnumber>
    <Wicon type="monitor" size="big" />
  </Wcontainer>,
mountNode);
```
更多组件使用方法请进入`基础组件`栏目查看。

### 参考资料：
- [NodeJS阿里手册](https://lark.alipay.com/alinode/handbook/env)
- [NodeJS官网](https://nodejs.org/en/)
- [NPM官网](https://www.npmjs.org/)
- [FIE](http://fie.alibaba-inc.com/)
- [AISC官网地址](http://aisc.alibaba.net/#/components)

