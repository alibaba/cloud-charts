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
import { OnlyDetailsLiteralLattice } from '@alife/p2widgets';

const onlyDetailsLiteralLatticeData={
  "a": 0,
  "b": 1990,
  "c": 23300,
  "d": 1.23,
}

const onlyDetailsLiteralLatticeDetails = [{
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
    <div>
         <OnlyDetailsLiteralLattice dataSource={onlyDetailsLiteralLatticeData} row={2} col={3} details={onlyDetailsLiteralLatticeDetails}/>
    </div>,
mountNode);
````
