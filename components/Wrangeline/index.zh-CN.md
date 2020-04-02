---
category: 组件
subtitle: RangeLine
type: 图表组件
title: Wrangeline
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

| 属性名         | 描述                                       | 类型                | 默认值                |
| ----------- | ---------------------------------------- | ----------------- | ------------------ |
| legend      | 图例配置项，支持 nameFormatter、valueFormatter，详情见 [图例 Legend](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142) | object \| boolean | {}                 |
| tooltip     | 提示信息配置项，支持 nameFormatter、valueFormatter，详情见 [提示信息 Tooltip](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143) | object \| boolean | {}                 |
| guide       | 辅助标记配置项，详情见 [辅助标记 Guide](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/144) | object \| boolean | null               |
| colors      | 图表颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.category_12 |
| padding     | 图表边距                                     | array             | [20, 20, 20, 20]   |
| autoSort    | 数据项是否自动排序，为true时将根据每一项的数值作降序排序           | boolean           | true               |
| cycle       | 是否为环图                                    | boolean           | false              |
| innerRadius | 圆环内环半径，数值范围 0 到 1，仅 cycle 为 true 时有效     | number            | 0.8                |
| outerRadius | 饼图外部半径，数值范围 0 到 1，不建议修改                  | number            | 0.8                |
