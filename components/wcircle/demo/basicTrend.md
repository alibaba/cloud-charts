---
order: 3
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了数值有趋势的用法。

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
      trend="raise"
      percent={0.3}>7</Wcircle>
    </div>,
mountNode);
````
