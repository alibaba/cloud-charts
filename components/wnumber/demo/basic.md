---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了数据和标题的用法。

## en-US


````jsx
import {
  Wnumber
} from '@alife/aisc-widgets'

const trend = function() {
  return (
    <span style={{fontSize: '14px'}}>+27%</span>
  )
}

ReactDOM.render(
    <div>
      <Wnumber bottomTitle="副标题" unit="个" trend={trend}>2222</Wnumber>
    </div>,
mountNode);
````
