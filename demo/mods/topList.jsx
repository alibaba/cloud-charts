import React from 'react';
import { TopList } from '@alife/p2widgets';

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    ip: '192.168.101.200',
    send: i + 1,
    receive: 100 - i
  });
}

class TwinTopList extends React.Component {
  render() {
    return (
      <TopList title="带宽 TOP10" dataSource={data}>
        <TopList.Group>
          <TopList.Group.Column title="Send" dataIndex="send" sortable />
          <TopList.Group.Column title="机器名" dataIndex="ip" />
        </TopList.Group>
        <TopList.Group>
          <TopList.Group.Column title="Receive" dataIndex="receive" sortable />
          <TopList.Group.Column title="机器名" dataIndex="ip" />
        </TopList.Group>
      </TopList>
    );
  }
}

export default TwinTopList;