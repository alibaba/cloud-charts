# iconTitleMini
## 简介：
具有icon和title的mini Widget。
主要包括：标题、icon信息

## API：

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
title | 标题的配置，文案、橙色阈值、红色阈值、阈值对比方式、数据源的键| Object | {"label":"Title","key":"title"}
iconType | 使用aisc组件的icon库指定显示哪种图标| string| "ais"
iconUrl | 使用网页图像的url| string| 
iconHtml| 使用icon的html| html| <Icon type="ais" size="large"/>
dataSource| 数据源,键匹配配置中的key| Object| {}

注：当iconType、iconUrl、iconHtml都存在时，使用优先级为：iconType>iconUrl>iconHtml

### title
属性 | 说明 | 类型 
--------- | -------------| -------------
label | 标题文案| String| 
orangeThreshold | 橙色阈值| String|
redThreshold | 红色阈值| String| 
compare | 阈值对比方式，可取“<”、“<=”、“>”、“>=”、“===”等等| String| 
key | 与数据中的key一一对应，用于获取相应数据| String|

### dataSource
属性 | 说明 | 类型 
--------- | -------------| -------------
data | 数据| String，Number| 
key | 与配置中的key一一对应| String|


