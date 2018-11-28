---
category: 组件
subtitle: 矩形分箱图
type: 图表组件
title: Wrectangle
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

| 属性名  | 描述                                                         | 类型              | 默认值                                                   |
| ------- | ------------------------------------------------------------ | ----------------- | -------------------------------------------------------- |
| xAxis   | X轴配置项，详情见 [坐标轴 Axis](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141) | object            | {}                                                       |
| yAxis   | Y轴配置项，详情见 [坐标轴 Axis](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141) | object            | {}                                                       |
| tooltip | 提示信息配置项，支持 nameFormatter、valueFormatter，详情见 [提示信息 Tooltip](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143) | object \| boolean | {}                                                       |
| label | 图形文本配置项，详情见 [图形文本 Label](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/286) | object \| boolean | false             |
| guide   | 辅助标记配置项，详情见 [辅助标记 Guide](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/144) | object \| boolean | null                                                     |
| colors  | 图表颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.widgetsColorLinear10 - COLORS.widgetsColorLinear1 |
| padding | 图表边距                                                     | array             | [32, 5, 32, 45]                                          |
| bin     | 分箱参数设置，详情见下方                                     | object            | {}                                                       |

### bin设置

| 属性名      | 描述                                 | 类型    | 默认值     |
| ----------- | ------------------------------------ | ------- | ---------- |
| fields      | 对应分箱数据中的x轴key和y轴key       | array   | ['x', 'y'] |
| bins        | XY方向上的分箱个数                   | array   | [ 20, 10 ] |
| binWidth    | XY方向上的分箱步长（会覆盖bins配置） | array   | undefined  |
| offset      | XY方向上的分箱偏移量                 | array   | [ 0, 0 ]   |
| sizeByCount | 是否根据分箱个数调整分箱大小         | boolean | false      |
