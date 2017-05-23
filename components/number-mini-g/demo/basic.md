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
import { NumberMiniG } from '@alife/p2widgets';

const demoStyle = {
  padding: 20
};

const dataSource={
  "a": 0,
  "b": 1990,
  "c": 23300,
  "d": 1.23,
}

const details = [{
  "label": "Text",
  "key": "a",
}, {
  "label": "Text",
  "key": "b",
  "cell": (value) => {
    return 'the value is ' + value;
  }
}, {
  "label": "Text",
  "key": "c",
}, {
  "label": "Text",
  "key": "d",
}, {
  "label": "Text",
  "key": "e",
}];


ReactDOM.render(
    <div style={demoStyle}>
         <NumberMiniG dataSource={dataSource} row={2} col={3} details={details}/>
    </div>,
mountNode);
````
