---
category: 组件
subtitle: NumberMiniG
type: 数值迷你卡片
title: G
cols: 1
---

## API

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
details | 详情的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Array| [{"label": "Text",“key”:"a"}, {"label": "Text",“key”:"b"}, {"label": "Text",“key”:"c"}, {"label": "Text",“key”:"d"}]
dataSource| 数据源| Object| {}
row| 行数,可选值：1、2、3、4、5、6| Number| 2
col| 列数，可选1、2、3、4、5、6| Number| 2

### details

属性 | 说明 | 类型 　
--------- | -------------| -------------
label | 文案| String|
orangeThreshold | 橙色阈值| String|
redThreshold | 红色阈值| String|
compare | 阈值对比方式| String|
cell | 自定义数据渲染函数| Function(value) |
key | 与数据中的key一一对应，用于获取相应数据| String|

### dataSource

属性 | 说明 | 类型
--------- | -------------| -------------
data | 数据| String，Number|
key | 与配置中的key一一对应| String|

