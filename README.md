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

