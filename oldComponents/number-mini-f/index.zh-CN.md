---
category: 组件
subtitle: NumberMiniF
type: 数值迷你卡片
title: F
cols: 1
---

## API

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
details | 详情的配置，包涵文案、单位、橙色阈值、红色阈值、阈值对比方式| Array| [{"label": "Text",“key”:"a", "unit":"unit"}, {"label": "Text",“key”:"b", "unit":"unit"}]
dataSource| 数据源| Object| {}

### details

属性 | 说明 | 类型 　
--------- | -------------| -------------
label | 文案| String|
unit | 单位| String|
orangeThreshold | 橙色阈值| String|
redThreshold | 红色阈值| String|
compare | 阈值对比方式| String|
key | 与数据中的key一一对应，用于获取相应数据| String|

### dataSource

属性 | 说明 | 类型
--------- | -------------| -------------
data | 数据| String，Number|
key | 与配置中的key一一对应| String|
