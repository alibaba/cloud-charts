# P2widgets

---

## 使用

1. 首先通过tnpm安装

```bash
$ tnpm i @alife/aisc-widgets
```

2. 安装成功即可使用

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Panel, RankList, RectLink } from '@alife/aisc-widgets'
const { Row, Col } = Grid;
const { Item, TitleSub } = Panel;

class App extends React.Component {
  render() {
    return (
      <div className="p2-chart-demo">
        <Row>
          <Col span="4">
            <RectLink title="OSD" subTitle="db" url="http://aisc.alibaba.net/"/>
          </Col>
          <Col span="9">
            <Panel>
              <HealthyStatus/>
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}
```

## 开发

```
1. git clone project
2. $ tnpm i
3. fie start
```

### 组件命名规范

组件分为两类：迷你卡片和普通卡片

迷你卡片名称为 {类型}Mini_{编号}

普通卡片名称为 描述该卡片的名词组合（尽量在两个词以内），如有重复的后面加 "_{编号}"

注：编号为英文字母，从A到Z

### 脚手架文件修改记录
site/theme/index.js 修改路由和排序规则
package.json
fie.config.js

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
