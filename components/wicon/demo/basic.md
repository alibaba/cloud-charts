---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了Icon的用法。

## en-US


````jsx
import {
  Wicon
} from '@alife/aisc-widgets'

ReactDOM.render(
    <div>
        <Wicon type="ais" status="none" />
        <Wicon type="ais" status="normal" />
        <Wicon type="ais" status="warning" />
        <Wicon type="ais" status="error" />
        <Wicon type="ais" status="success" />
        <br />
        <Wicon type="ais" size="medium" status="none" />
        <Wicon type="ais" size="medium" status="normal" />
        <Wicon type="ais" size="medium" status="warning" />
        <Wicon type="ais" size="medium" status="error" />
        <Wicon type="ais" size="medium" status="success" />
    </div>,
mountNode);
````
