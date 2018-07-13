---
category: 组件
subtitle: 柱图
type: 图表组件
title: Wbar
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

| 属性名       | 描述                                                         | 类型              | 默认值             |
| ------------ | ------------------------------------------------------------ | ----------------- | ------------------ |
| xAxis        | X轴配置项，详情见 [坐标轴 Axis](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141) | object            | {}                 |
| yAxis        | Y轴配置项，详情见 [坐标轴 Axis](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/141) ，如果传入配置项数组则变为双Y轴图表 | object \| array   | {}                 |
| legend       | 图例配置项，支持 align、nameFormatter，详情见 [图例 Legend](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142) | object \| boolean | {}                 |
| tooltip      | 提示信息配置项，支持 titleFormatter、nameFormatter、valueFormatter，详情见 [提示信息 Tooltip](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143) | object \| boolean | {}                 |
| guide        | 辅助标记配置项，详情见 [辅助标记 Guide](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/144) | object \| boolean | null               |
| colors       | 图表颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.category_12 |
| padding      | 图表边距                                                     | array             | [32, 5, 32, 45]    |
| column       | 是否为垂直柱图，设置为 false 可变为水平柱图                  | boolean           | true               |
| marginRatio  | 分组间距。用于调整分组柱图中分组内柱子的间距。范围从0到1     | number            | 0                  |
| stack        | 是否为堆栈柱图                                               | boolean           | false              |
| stackReverse | 是否倒序堆叠                                                 | boolean           | true               |
| dodgeStack   | 是否为分组堆叠图                                             | boolean           | false              |
| grid         | 是否显示网格线                                               | boolean           | false              |
| facet        | 是否分面                                                     | object \| boolean | false              |
| zoom         | 是否开启拖拽缩放。在非堆叠时生效。                           | boolean           | false              |
