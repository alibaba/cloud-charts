# TXD-Widgets 让图表更简单

> 我们不用很麻烦很累就可以画出好看的图表📈🎉

TXD-Widgets 是一个面向业务的开箱即用图表库，只为让前端图表更简单。

特点是简单易用，有丰富的业务积累，同时可以使用Highcharts的数据格式。

[官方网站](https://widgets.alibaba-inc.com/) - [图表示例](https://widgets.alibaba-inc.com/example) - [API文档](https://widgets.alibaba-inc.com/documentation) - [可视化编辑](https://widgets.alibaba-inc.com/studio) 

欢迎关注我们的开源版本：https://github.com/alibaba/cloud-charts

## 安装

### 浏览器引入

可以将脚本下载到本地引入，也可以直接引入线上资源；

```html
<!-- 引入在线资源 -->
<link rel="stylesheet" href="https://g.alicdn.com/aisc/aisc-widgets/3.0.0/index.css">
<script src="https://g.alicdn.com/aisc/aisc-widgets/3.0.0/index.js"></script>
```

```html
<!-- 引入本地脚本 -->
<link rel="stylesheet" href="./aisc-widgets/index.css">
<script src="./aisc-widgets/index.js"></script>
```

### 通过 tnpm 安装

[![img](http://web.npm.alibaba-inc.com/badge/v/@alife/aisc-widgets.svg?style=flat-square)](http://web.npm.alibaba-inc.com/package/@alife/aisc-widgets)

我们也提供了 tnpm 包，通过下面的命令即可完成安装

```bash
tnpm install @alife/aisc-widgets --save
```

成功安装完成之后，即可使用 `import` 或 `require` 进行引用。

```jsx
import { Wcontainer, Wline } from '@alife/aisc-widgets';
```

## 开始使用

成功安装后，我们就已经做好了创建第一个图表的准备了。

下面是以一个基础的柱状图为例开始我们的第一个图表创建。

#### 1. 创建图表容器

在页面的 `body` 部分创建一个 div，并制定必须的属性 `id`：

```jsx
<div id="mountNode"></div>
```

#### 2. 使用组件生成图表

- 引入图表需要的组件
- 用组件组装成需要的图表
- 把图表渲染到 mountNode 节点上

这部分代码用 `<script></script>`，可以放在页面代码的任意位置（最好的做法是放在 `</body>` 之前）。

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Wcontainer, Wbar } from '@alife/aisc-widgets';

const data = [
  {
    "name":"柱1",
    "data":[["一",59],["二",23],["三",19],["四",27],["五",77],["六",100],["七",70],["八",61],["九",15]]
  },{
    "name":"柱2",
    "data":[["一",92],["二",15],["三",4],["四",49],["五",64],["六",76],["七",21],["八",100],["九",71]]
  }
];

const options = {
  legend:{
    align: 'right'
  }
};

class Demo extends React.Component{
  render(){
    return (
      <Wcontainer className="demos">
        <Wbar height="400" config={options} data={data} />
      </Wcontainer>
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('mountNode'));
```

一张柱状图就绘制成功了。

## 开发

```bash
1. git clone project
2. $ tnpm i

// 测试使用 storybook
npm run storybook

// 切分支
$ git checkout -b daily/3.0.x

// 更新版本号
$ tnpm version patch

// 发布日常
$ def publish -d

// code Review
https://space.o2.alibaba-inc.com/app/7154/iteration

// 发布tnpm，在发布线上前完成
$ tnpm publish

// 发布线上
$ def publish -o
```

### 组件命名规范

前缀W，使用驼峰命名。
