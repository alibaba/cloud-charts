---
order: 0
title:
  zh-CN: 选项卡模式
  en-US: Tab
---

## zh-CN

选项卡模式，通过选项卡切换数据分组。

## en-US


````jsx
import { TopList } from '@alife/p2widgets';

const demoStyle = {
  padding: 20
};

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    ip: '192.168.101.200',
    send: i + 1,
    receive: 100 - i,
    read: Math.round(Math.random() * 100) + i,
    write: Math.round(Math.random() * (100 + i))
  });
}

class TopListDemo extends React.Component {
  render() {
    return (
      <div style={demoStyle}>
        <TopList title="慢盘 TOP10" dataSource={data} tabMode titleAlign="left">
          <TopList.Group title="OP latency">
            <TopList.Group.Column title="OP latency" dataIndex="read" sortable cell={(v) => `${v}ms`} />
            <TopList.Group.Column title="OSD号" dataIndex="ip" align="right" width="auto" />
            <TopList.Group.Column title="commit延时" dataIndex="receive" align="right" width="auto" cell={(v) => `${v}ms`} />
            <TopList.Group.Column title="apply" dataIndex="send" align="right" width="auto" cell={(v) => `${v}ms`} />
          </TopList.Group>
          <TopList.Group title="Apply latency">
            <TopList.Group.Column title="Apply latency" dataIndex="write" sortable cell={(v) => `${v}ms`} />
            <TopList.Group.Column title="OSD号" dataIndex="ip" align="right" width="auto" />
            <TopList.Group.Column title="commit延时" dataIndex="receive" align="right" width="auto" cell={(v) => `${v}ms`} />
            <TopList.Group.Column title="apply" dataIndex="send" align="right" width="auto" cell={(v) => `${v}ms`} />
          </TopList.Group>
          <TopList.Group title="Journal latency">
            <TopList.Group.Column title="Journal latency" dataIndex="send" sortable cell={(v) => `${v}ms`} />
            <TopList.Group.Column title="OSD号" dataIndex="ip" align="right" width="auto" />
            <TopList.Group.Column title="commit延时" dataIndex="receive" align="right" width="auto" cell={(v) => `${v}ms`} />
            <TopList.Group.Column title="apply" dataIndex="send" align="right" width="auto" cell={(v) => `${v}ms`} />
          </TopList.Group>
        </TopList>
      </div>
    );
  }
}

ReactDOM.render(<TopListDemo />, mountNode);
````
