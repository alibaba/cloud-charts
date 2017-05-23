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
import { BarMiniA} from '@alife/p2widgets';

const demoStyle = {
  padding: 20
};

const dataSource={
  "title":0,
  "a": 0,
  "b": 0.75,
}

ReactDOM.render(
    <div style={demoStyle}>
      <BarMiniA dataSource={dataSource}/>
    </div>,
mountNode);
````
