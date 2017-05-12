---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

中文说明

## en-US


````jsx
import { PieChartTitleMini } from '@alife/p2widgets';

const ringRroportionData={
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
    <div>
        <PieChartTitleMini dataSource={ringRroportionData} cell={cell}/>
    </div>,
mountNode);
````
