﻿---
order: 10
title:
  zh-CN: 仪表盘
  en-US: Basic
---

## zh-CN

基础用法，演示了仪表盘用法。

## en-US

basic use.


````jsx
import {
  Wcircle
} from '@alife/aisc-widgets'

ReactDOM.render(
    <div>
      <Wcircle type="gauge" 
      title="标题"
      status="orange"
      bottomTitle="底部标题" 
      bottomNumber={2} 
      percent={0.45}
      bottomTrend="drop">7</Wcircle>
    </div>,
mountNode);
````