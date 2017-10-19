---
order: 14
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了自定义圆环粗细的基本用法。

## en-US

basic use.


````jsx
import {
  Wcircle
} from '@alife/aisc-widgets'

ReactDOM.render(
    <div>
      <Wcircle 
      title="标题"
      radius={60}
      strokeWidth={4}
      percent={0.9}>2</Wcircle>
    </div>,
mountNode);
````
