# Aisc-Widgets

---

Aisc-Widgets 是一个基于日常业务沉淀的简便图表库，底层为G2封装。特点是简单易用，有丰富的业务积累，同时可以使用Highcharts的数据格式。

## 安装

### 浏览器引入

可以将脚本下载到本地引入，也可以直接引入线上资源；

```html
<!-- 引入在线资源 -->
<link rel="stylesheet" href="https://g.alicdn.com/aisc/aisc-widgets/2.2.3/index.css">
<script src="https://g.alicdn.com/aisc/aisc-widgets/2.2.3/index.js"></script>
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

```
1. git clone project
2. $ tnpm i
3. fie start
//发布日常
4. fie publish -d
//发布线上
4. fie publish -o
```

### 组件命名规范

前缀w，使用驼峰命名。

### 组件开发规范

```
/ 组件文件夹
  / scss
    function.scss
    mixin.scss
    variable.scss
  index.jsx
  index.scss
```


- scss 样式文件
  - 尺寸与颜色等皆不可直接写死，需调用`@alife/aisc-core`中的标准尺寸与颜色变量，如存在缺少变量的问题，联系@笑斌
  - 如存在复用场景，不可复制黏贴多份，而应多多使用`scss`的`function`概念, 写入`function.scss`或`mixin.scss`中。在多个组件同时存在可复用的函数时候，建议抽出该函数，并尝试进行统一封装。

- jsx 逻辑视图文件
  - 一个`class`一个文件
  - 在不确定输入类型，或存在多种输入类型时，可使用子组件
  - 所有`class`添加`prop-types`,不论是父组件还是子组件
  - render函数一般情况下不可过长，中间不应存在大段的校验计算函数（可包装），保证逻辑通顺不阻断
  - demo不应太少，对于一般的使用场景都应包含，亦不可过于繁冗，保持精简有效
