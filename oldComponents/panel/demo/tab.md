---
order: 1
title:
  zh-CN: 选项卡模式
  en-US: Tab
---

## zh-CN

卡片包含了一些固定的样式，用于包裹可视化组件，形成统一的视觉表现。

## en-US


````jsx
import { Panel } from '@alife/aisc-widgets';
const { Item, TitleSub } = Panel;

const demoStyle = {
  padding: 20,
  background: '#f8f8f8'
};
class PanelDemo extends React.Component {
  render() {
    return (
      <div style={demoStyle}>
        <Panel title="卡片标题" tabMode>
          <Item title="first">
            卡片内容1
          </Item>
          <Item title="第二个">
            卡片内容2
          </Item>
          <Item title="third">
            卡片内容3
          </Item>
        </Panel>
      </div>
    );
  }
}

ReactDOM.render(<PanelDemo />, mountNode);
````
