---
category: 组件
subtitle: 占位图
type: 基础组件
title: Wplaceholder
---

## API

| 属性        | 说明                                       | 类型     | 默认值    |
| ---------- | ---------------------------------------- | ------ | ------ |
| className | 自定义样式名     | String | '' |
| style      | 自定义样式                                 | object | {}   |
| height | 高度                | String or Number | ‘100%’ |
| loading    | 是否加载中                                  | Boolean | false |
| error     | 是否异常 |Boolean | false |
| locale     | 国际化数据    | object | { loading: '加载中...',   error: '数据异常' } |
| language | 语言                                   | String| 'zh-cn' |
| 子元素(children) | 显示的文案，会覆盖locale和language中的设置       | String | '' |

