---
category: 组件
subtitle: 线柱图
type: 图表组件
title: Wlinebar
cols: 1
---


## API

### 通用参数

| 属性名    | 描述                                       | 类型               | 默认值      |
| ------ | ---------------------------------------- | ---------------- | -------- |
| width  | 图表宽度                                     | number \| string | 自适应父元素宽度 |
| height | 图表高度                                     | number \| string | 自适应父元素高度 |
| config | 图表配置，详情见下方                               | object           | {}       |
| data   | 图表数据，详情见 [数据 Data](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/140) | array            | []       |
| event  | 图表交互事件，详情见 [图表事件 Event](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/145) | object           | {}       |

### 配置项

| 属性名        | 描述                                       | 类型                | 默认值                         |
| ---------- | ---------------------------------------- | ----------------- | --------------------------- |
| xAxis      | X轴配置项，详情见 [坐标轴 Axis](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141) | object            | {}                          |
| yAxis      | Y轴配置项，详情见 [坐标轴 Axis](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141) ，如果传入配置项数组则变为双Y轴图表 | object \| array   | {}                          |
| legend     | 图例配置项，支持 align、nameFormatter，详情见 [图例 Legend](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142) | object \| boolean | {}                          |
| tooltip    | 提示信息配置项，支持 titleFormatter、nameFormatter、valueFormatter，详情见 [提示信息 Tooltip](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143) | object \| boolean | {}                          |
| lineLabel | 折线的图形文本配置项，详情见 [图形文本 Label](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/286) | object \| boolean | false             |
| barLabel | 柱图的图形文本配置项，详情见 [图形文本 Label](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/286) | object \| boolean | false             |
| guide      | 辅助标记配置项，详情见 [辅助标记 Guide](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/144) | object \| boolean | null                        |
| lineColors | 图表中折线的颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.category_12.slice(1) |
| barColors  | 图表中柱图的颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.linear_10            |
| padding    | 图表边距                                     | array             | [32, 45, 32, 45]            |
| area       | 是否为面积曲线                                  | boolean           | false                       |
| stack      | 是否为堆栈图，折线堆栈仅 area 为 true 时有效，柱状堆栈可直接开启   | boolean           | false                       |
| stackReverse | 是否倒序堆叠                                                 | boolean           | true               |
| dodgeStack   | 是否为分组堆叠图                                             | boolean           | false              |
| spline     | 是否为平滑曲线                                  | boolean           | false                       |
| grid       | 是否显示网格线                                  | boolean           | false                       |
| symbol     | 是否显示线上的点                                 | boolean           | false                       |