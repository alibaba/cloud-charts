---
category: 组件
subtitle: 漏斗图
type: 图表组件
title: Wfunnel
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

| 属性名    | 描述                                                         | 类型              | 默认值          |
| --------- | ------------------------------------------------------------ | ----------------- | --------------- |
| legend    | 图例配置项，支持 align、nameFormatter，详情见 [图例 Legend](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/142) | object \| boolean | {}              |
| tooltip   | 提示信息配置项，支持 nameFormatter、valueFormatter，详情见 [提示信息 Tooltip](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/143) | object \| boolean | {}              |
| guide     | 辅助标记配置项，详情见 [辅助标记 Guide](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/144) | object \| boolean | null            |
| colors    | 图表颜色数组，详情见 [颜色 Color](http://aisc.alibaba-inc.com/site/pc#/cate/4/page/149) | array             | COLORS.order_10 |
| padding   | 图表边距                                                     | array             | [40, 0, 0, 0]   |
| direction | 漏斗方向，可选项 'vertical' (从上到下)、'horizontal' (从左到右) | string            | 'vertical'      |
| align     | 排列位置。当 direction 为 'vertical' 时可选 'left', 'center', 'right'。当 direction 为 'horizontal' 时可选 'top', 'center', 'bottom'。 | string            | 'center'        |
| pyramid   | 是否为尖顶漏斗图。仅 align 为 'center' 时有效                | boolean           | false           |
