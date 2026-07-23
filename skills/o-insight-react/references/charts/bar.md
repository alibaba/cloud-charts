# Bar — 柱状图

比较分类数据大小。多系列默认分组（dodge），或 `stack:true` 堆叠。

## API

```tsx
import { Bar } from '@alicloud/cloud-charts-react';
import type { BarSeries, BarChartConfig } from '@alicloud/cloud-charts-core';
```

- `data: BarSeries[]`（必填）
- `config?: BarChartConfig`
- 通用 props：`height`(默认 300)、`width`(默认 '100%')、`theme`、`language`、`loading`、`emptyInfo`、`errorInfo`、`event`

## data 形状

```ts
interface BarSeries {
  name: string;                              // 系列名（图例项）
  data: Array<[category, value]>;            // 元组：[分类, 数值]
  visible?: boolean;                         // 是否默认显示
}
// category/value 为 string | number | boolean | null
```

## config 字段（全部可选，含开放索引签名）

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `stack` | boolean | false | 堆叠 |
| `dodge` | boolean | true | 分组并列 |
| `percentage` | boolean | false | 百分比堆叠 |
| `showStackSum` | boolean | — | 堆叠显示总和 |
| `legend` | boolean\|object | — | `false` 关闭；对象设 `position` 等 |
| `tooltip` | boolean\|object | — | 提示框 |
| `xAxis` | object\|false | — | X 轴 |
| `yAxis` | object\|false | — | Y 轴 |
| `label` | boolean\|object | false | 数据标签 |
| `grid` | boolean | false | 网格线 |
| `zoom` | boolean | false | 缩放 |
| `slider` | boolean\|object | — | 滑块 |
| `scrollbar` | boolean\|object | — | 滚动条 |
| `colors` | 色板 | — | 颜色 |
| `columnWidthRatio` / `marginRatio` | number | — | 柱宽/间距比 |

## 示例

```tsx
const data: BarSeries[] = [
  { name: '2025', data: [['一季度', 120], ['二季度', 132], ['三季度', 101], ['四季度', 134]] },
  { name: '2026', data: [['一季度', 90], ['二季度', 155], ['三季度', 130], ['四季度', 148]] },
];

// 分组（默认）
<Bar data={data} config={{ legend: { position: 'top' }, label: true }} height={320} />

// 堆叠
<Bar data={data} config={{ stack: true }} height={320} />

// 百分比堆叠
<Bar data={data} config={{ stack: true, percentage: true }} height={320} />
```

## 陷阱
- 水平条形通过 config 转置能力实现，不要找 `<Column>`（不存在）。
- 分类过多时开 `slider` 或 `scrollbar`，不要手动截断 data。
