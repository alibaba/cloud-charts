---
order: 0
title:
  zh-CN: 基本
  en-US: Basic
---

## zh-CN

基础用法，演示了容器大小。

## en-US


````jsx
import {
  Wcontainer, Wnumber
} from '@alife/p2widgets'


ReactDOM.render(
    <div>
        <Wcontainer title={'数据库机器数指标'} width={'400px'} height={'200px'}>
            <Wnumber subTitle="副标题" unit="个">2222</Wnumber>
        </Wcontainer>
    </div>,
mountNode);
````
