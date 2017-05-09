# OnlyDetailsLiteralRowsMini
## 简介：
只有详情信息且全部为文字的一行一行的mini Widget。
主要包括：
详情，每个值都有对应阈值和阈值对比方式配置，符合的值将显示出不同的状态。状态包涵：正常（蓝色）、不太正常（橙色）、不正常（红色）。

## API：

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


