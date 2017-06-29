---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了迷你卡片的使用方法。

## en-US


````jsx
import { NumberMiniF} from '@alife/aisc-widgets';

const demoStyle = {
  padding: 20
};

const dataSource={
  "a":12,
  "b": 9679
}

ReactDOM.render(
    <div style={demoStyle}>
      <NumberMiniF dataSource={dataSource}/>
    </div>,
mountNode);
````
