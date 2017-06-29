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
import { CircleMiniB } from '@alife/aisc-widgets';

const demoStyle = {
  padding: 20
};

const dataSource={
  "divisor": 56,
  "dividend": 100,
  "a": 0,
  "b": 1990,
  "c": 23300,
  "d": 1.23,
}
const cell = function(v){
  return v+'M';
}

ReactDOM.render(
    <div style={demoStyle}>
        <CircleMiniB dataSource={dataSource} cell={cell}/>
    </div>,
mountNode);
````
