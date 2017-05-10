---
category: 组件
subtitle: BarChartDetailsMini
type: 信息展示
title: 带标题柱图卡片
cols: 1
---

## API

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
title | 标题的配置，文案、橙色阈值、红色阈值、阈值对比方式、数据源的键| Object | {"label":"Title","key":"title"}
details | 详情的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Array| [{"label":"Text","key":"a"},{"label":"Text","key":"b"}]
dataSource| 数据源,键匹配配置中的key| Object| {}


### title

属性 | 说明 | 类型
--------- | -------------| -------------
label | 标题文案| String|
orangeThreshold | 橙色阈值| String|
redThreshold | 红色阈值| String|
compare | 阈值对比方式，可取“<”、“<=”、“>”、“>=”、“===”等等| String|
key | 与数据中的key一一对应，用于获取相应数据| String|

### details

属性 | 说明 | 类型 　
--------- | -------------| -------------
label | 文案| String|
orangeThreshold | 橙色阈值| String|
redThreshold | 红色阈值| String|
compare | 阈值对比方式| String|
key | 与数据中的key一一对应，用于获取相应数据| String|

### dataSource

属性 | 说明 | 类型
--------- | -------------| -------------
data | 数据| String，Number|
key | 与配置中的key一一对应| String|
