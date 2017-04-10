import React from 'react';
import { Grid, Panel, TopList } from '@alife/p2widgets';
const { Row, Col } = Grid;
const { Item } = Panel;

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

class TwinTopList extends React.Component {
  render() {
    return (
      <div>
        <Row>
          <Col span="24">
            <Panel>
              <Item>
                <TopList title="带宽 TOP10" dataSource={data}>
                  <TopList.Group>
                    <TopList.Group.Column title="Send" dataIndex="send" sortable cell={(v) => `${v}M/s`} />
                    <TopList.Group.Column title="机器名" dataIndex="ip" align="right" />
                  </TopList.Group>
                  <TopList.Group>
                    <TopList.Group.Column title="Receive" dataIndex="receive" sortable />
                    <TopList.Group.Column title="机器名" dataIndex="ip" align="right" />
                  </TopList.Group>
                </TopList>
              </Item>
              <Item>
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
              </Item>
              <Item>
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
              </Item>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Panel>
              <Item>
                <TopList title="慢盘 TOP10" dataSource={data} titleAlign="left">
                  <TopList.Group title="慢盘">
                    <TopList.Group.Column title="慢盘" dataIndex="read" sortable cell={(v) => `${v}ms`} />
                    <TopList.Group.Column title="OSD号" dataIndex="ip" align="right" width="auto" />
                    <TopList.Group.Column title="commit延时" dataIndex="receive" align="right" width="auto" cell={(v) => `${v}ms`} />
                    <TopList.Group.Column title="apply" dataIndex="send" align="right" width="auto" cell={(v) => `${v}ms`} />
                  </TopList.Group>
                </TopList>
              </Item>
              <Item>
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
              </Item>
            </Panel>
          </Col>
        </Row>
      </div>

    );
  }
}

export default TwinTopList;