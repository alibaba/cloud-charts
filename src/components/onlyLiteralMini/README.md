# onlyLiteralMini
## 简介：
全部为文字的mini Widget。
主要包括：标题、副标题、详情，每个值都有对应阈值和阈值对比方式配置，符合的值将显示出不同的状态。状态包涵：正常（蓝色）、不太正常（橙色）、不正常（红色）。

## API：

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
title | 标题的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Object | {"label":"Status","redThreshold":"Unhealthy","compare":" === ","key":"title"}
subTitle | 副标题的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Object| {"label":"Monitors in Quorum","key":"subTitle"}
details | 详情的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Array| [{"label": "OSD in",“key”:"a"}, {"label": "OSD out",“key”:"b"}, {"label": "OSD up",“key”:"c"}, {"label": "OSD down",“key”:"d"}]
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


