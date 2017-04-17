# RingRroportion
## 简介：
显示环占比的Widget。
主要包括：环文案、除数文案、被除数文案、详情，每个值都有对应阈值和阈值对比方式配置，符合的值将显示出不同的状态。状态包涵：正常（蓝色）、不太正常（橙色）、不正常（红色）。

## API：

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
title | 环占比的配置，包涵环文案、除数分子文案、被除数分母文案、橙色阈值、红色阈值、阈值对比方式、除数对应数据源的键、被除数对应数据源的键| Object | {"ring":"使用率","divisor":"已使用容量","dividend":"总容量","orangeThreshold":0.6,"redThreshold":0.8,"compare":">","divisorKey":"divisor","dividendKey":"dividend"}
details | 详情的配置，包涵文案、橙色阈值、红色阈值、阈值对比方式| Array| [{"label":"Pools","key":"a"},{"label":"rbd","key":"b"},{"label":"总PG数","key":"c"},{"label":"PG分布标准差","key":"d"}]
dataSource| 数据源,键匹配配置中的key| Object| {}


### title
属性 | 说明 | 类型 
--------- | -------------| -------------
ring | 环中心文案| String| 
divisor | 除数文案| String| 
dividend | 被除数文案| String| 
orangeThreshold | 橙色阈值| String|
redThreshold | 红色阈值| String| 
compare | 阈值对比方式，可取“<”、“<=”、“>”、“>=”、“===”等等| String| 
divisorKey | 分子的键，与数据中的key一一对应，用于获取相应数据| String|
dividendKey | 分母的键，与数据中的key一一对应，用于获取相应数据| String|

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


