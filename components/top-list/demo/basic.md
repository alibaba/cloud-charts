---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了分组宽度，水平对齐位置，排序列，自定义渲染函数等用法。

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
        <TopList title="带宽 TOP10">
          <TopList.Group dataSource={data}>
            <TopList.Group.Column title="Send" dataIndex="send" sortable cell={(v) => `${v}M/s`} />
            <TopList.Group.Column title="机器名" dataIndex="ip" align="right" />
          </TopList.Group>
          <TopList.Group dataSource={data}>
            <TopList.Group.Column title="Receive" dataIndex="receive" sortable />
            <TopList.Group.Column title="机器名" dataIndex="ip" align="right" />
          </TopList.Group>
        </TopList>
        <TopList title="IOPS TOP10" dataSource={data}>
          <TopList.Group>
            <TopList.Group.Column title="Read" dataIndex="read" sortable />
            <TopList.Group.Column title="机器名" dataIndex="ip" />
          </TopList.Group>
          <TopList.Group>
            <TopList.Group.Column title="Write" dataIndex="write" sortable />
            <TopList.Group.Column title="机器名" dataIndex="ip" align="right" />
          </TopList.Group>
        </TopList>
        <TopList title="吞吐 TOP10" dataSource={data}>
          <TopList.Group width="auto">
            <TopList.Group.Column title="Send" dataIndex="send" sortable align="right" />
            <TopList.Group.Column title="机器名" dataIndex="ip" align="left" />
          </TopList.Group>
          <TopList.Group align="right">
            <TopList.Group.Column title="Receive" dataIndex="receive" sortable />
            <TopList.Group.Column title="机器名" dataIndex="ip" />
          </TopList.Group>
        </TopList>
      </div>
    );
  }
}

ReactDOM.render(<TopListDemo />, mountNode);
````
