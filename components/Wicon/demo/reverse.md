---
order: 0
title:
  zh-CN: 颜色翻转
  en-US: Reverse
---

## zh-CN

设置 reverse 进行颜色翻转

## en-US


````jsx
import {
  Wicon
} from '@alife/aisc-widgets'

ReactDOM.render(
    <div>
        <Wicon type="ais" reverse status="none" />
        <Wicon type="ais" reverse status="normal" />
        <Wicon type="ais" reverse status="warning" />
        <Wicon type="ais" reverse status="error" />
        <Wicon type="ais" reverse status="success" />
        <br />
        <Wicon type="ais" reverse size="medium" status="none" />
        <Wicon type="ais" reverse size="medium" status="normal" />
        <Wicon type="ais" reverse size="medium" status="warning" />
        <Wicon type="ais" reverse size="medium" status="error" />
        <Wicon type="ais" reverse size="medium" status="success" />
    </div>,
mountNode);
````
