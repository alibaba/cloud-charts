---
category: 组件
subtitle: 数字跳动
type: 基础组件
title: Wcount
---

## API

| 属性        | 说明                                       | 类型     | 默认值    |
| ---------- | ---------------------------------------- | ------ | ------ |
| start | 跳动起始值  | Number | 0    |
| end   | 跳动起始值                                 | Number | 0    |
| decimals | 小数位数              | Number | 0    |
| duration | 跳动持续时间（单位：秒）                         | Number | 1.5  |
| useEasing | 跳动效果使用缓动函数 |Boolean | true |
| useGrouping | 是否千分位格式化 | Boolean | true |
| separator | 千分位分隔符                             | String | ,（半角逗号） |
| decimal | 小数分隔符                              | String | .（半角句号） |
| placeholder | 无数据时显示内容                           | String | -（半角扩折号） |
| clipNum | 数据分片个数 | Number | 1 |
| clipPeriod | 分片显示周期 | Number | 5 |
| slipScale | 自定义切片比例，默认为均匀切片 | Array | [] |
