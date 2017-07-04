---
category: 组件
subtitle: ButtonMiniA
type: 按钮迷你卡片
title: A
cols: 1
---

## API

属性 | 说明 | 类型 | 默认值
--------- | -------------| -------------| -------------
title | 标题文案| String | null
subTitle | 副标题文案| String| null
iconType | 使用aisc组件的icon库指定显示哪种图标| string| "ais"
iconUrl | 使用网页图像的url| string| null
iconHtml| 使用icon的html| html| <Icon type="ais" size="large"/>
url | 跳转的url| String| null
isBlank | 是否在新窗口中打开| bool| true

注：当iconType、iconUrl、iconHtml都存在时，使用优先级为：iconType>iconUrl>iconHtml

