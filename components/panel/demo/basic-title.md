---
order: 1
title:
  zh-CN: 基本-带标题
  en-US: Basic-Title
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
        <Panel title="卡片标题">
          卡片内容
        </Panel>
      </div>
    );
  }
}

ReactDOM.render(<PanelDemo />, mountNode);
````
