---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了基本用法。

## en-US

basic use.


````jsx
import {
  Wcircle
} from '@alife/aisc-widgets'

ReactDOM.render(
    <div>
      <Wcircle type="gauge" 
      title="本周未达标指标"
      status="red"
      bottomTitle="较上周" 
      bottomNumber={2} 
      percent={0.45}
      bottomTrend="raise">7</Wcircle>
    </div>,
mountNode);
````
