# P2widgets

---

## 使用

1. 首先通过tnpm安装

```bash
$ tnpm i @alife/p2widgets
```

2. 安装成功即可使用

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Panel, RankList, RectLink } from '@alife/p2widgets'
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
