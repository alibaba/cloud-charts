---
category: 组件
subtitle: 圆环
type: 基础组件
title: Wcircle 
---

## API

| 属性        | 说明                                       | 类型     | 默认值    |
| ---------- | ---------------------------------------- | ------ | ------ |
| type      | 类型：gauge(仪表盘)、 circle(圆环)           | "gauge"、"circle" | 'circle'     |
| title      | 标题                                      | String | ''     |
| percent    | 数值，0-1的数值，表示环比                  | Number | 0     |
| unit       | 单位                                     | String | ''     |
| status     | 数值状态, 填写 normal(正常)、warning(二级告警)、error(一级告警) |"normal", "warning", "error" | "normal"     |
| color | 圆环颜色，会覆盖 status 设置预置的颜色。 |String | null |
| trend      | 数值趋势, 填写 raise或者drop自动处理数字    | "raise", "drop" | ''  |
| bottomTitle| 底部标题                                   | String| ''  |
| bottomUnit | 底部单位                                   | String| ''  |
| bottomNumber| 底部数值                                   | Number| null  |
| bottomTrend| 底部数值趋势, 填写raise或者drop自动处理数字    | "raise", "drop" | ''  |
| linecap | 圆环两端圆角，round 为圆角，butt 为直角 | "round", "butt" | "round" |
