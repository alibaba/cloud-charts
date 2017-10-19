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
| status     | 数值状态, 填写blue(正常)、orange(二级告警)、red(一级告警) |"blue", "orange", "red" | "blue"     |
| trend      | 数值趋势, 填写raise或者drop自动处理数字    | "raise", "drop" | ''  |
| bottomTitle| 底部标题                                   | String| ''  |
| bottomUnit | 底部单位                                   | String| ''  |
| bottomNumber| 底部数值                                   | Number| null  |
| bottomTrend| 底部数值趋势, 填写raise或者drop自动处理数字    | "raise", "drop" | ''  |
