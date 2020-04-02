---
order: 1
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了标题后有单位的用法。

## en-US

basic use.


````jsx
import {
  Wcircle
} from '@alife/aisc-widgets'

ReactDOM.render(
    <div>
      <Wcircle 
      title="标题可以长一点"
      unit="单位"
      percent={0.2}>7</Wcircle>
    </div>,
mountNode);
````
