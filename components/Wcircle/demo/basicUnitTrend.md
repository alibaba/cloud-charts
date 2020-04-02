---
order: 5
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了数值有趋势和单位的用法。

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
      status="orange"
      trend="drop"
      unit="单位"
      percent={0.3}>7</Wcircle>
    </div>,
mountNode);
````
