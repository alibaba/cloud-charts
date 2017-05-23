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
import { NumberMiniD} from '@alife/p2widgets';

const demoStyle = {
  padding: 20
};

const dataSource={
  "title":"Healthy",
  "subTitle":0,
  "a": 0,
  "b": 199,
  "c": 233,
  "d": 199,
}

ReactDOM.render(
    <div style={demoStyle}>
      <NumberMiniD dataSource={dataSource}/>
    </div>,
mountNode);
````
