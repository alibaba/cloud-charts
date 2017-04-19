# iconLinkButtonMini
## 简介：
具有icon的跳转mini Widget。
主要包括：标题、副标题、icon、跳转url

## API：

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
title | 标题文案| String | 
subTitle | 副标题文案| String| 
iconType | 使用aisc组件的icon库指定显示哪种图标| string| "ais"
iconUrl | 使用网页图像的url| string| 
iconHtml| 使用icon的html| html| <Icon type="ais" size="large"/>
url | 跳转的url| String| null

注：当iconType、iconUrl、iconHtml都存在时，使用优先级为：iconType>iconUrl>iconHtml


