---
order: 0
title:
  zh-CN: 基本-无标题
  en-US: Basic
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
        <Panel>
          卡片内容
        </Panel>
      </div>
    );
  }
}

ReactDOM.render(<PanelDemo />, mountNode);
````
