---
category: 组件
subtitle: OnlyLiteralMini
type: 信息展示
title: 仅文字迷你卡片
cols: 1
---

## API

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
title | 标题的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Object | {"label":"Title","key":"title"}
subTitle | 副标题的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Object| {"label":"subTitle","key":"subTitle"}
details | 详情的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Array| [{"label": "Text",“key”:"a"}, {"label": "Text",“key”:"b"}, {"label": "Text",“key”:"c"}, {"label": "Text",“key”:"d"}]
dataSource| 数据源| Object| {}
onClickHealthy | 标题对应值的点击事件| function|

### title、subTitle

属性 | 说明 | 类型
--------- | -------------| -------------
label | 文案| String|
orangeThreshold | 橙色阈值| String|
redThreshold | 红色阈值| String|
compare | 阈值对比方式，可取“<”、“<=”、“>”、“>=”、“==”等等| String|
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
