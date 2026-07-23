# Pie — 饼图 / 环形图

展示部分占整体的比例。`cycle:true` 变环形。切片 ≤7 个最佳。

## API

```tsx
import { Pie } from '@alicloud/cloud-charts-react';
import type { PieSeries, PieChartConfig } from '@alicloud/cloud-charts-core';
```

## data 形状

```ts
interface PieSeries {
  name: string;
  data: Array<[label, value]>;   // 元组：[类别标签, 数值]。注意：无 visible 字段
}
```
> 通常只有一个系列。多切片放在同一个 `data` 数组里。

## config 字段

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `cycle` | boolean | false | 环形（甜甜圈） |
| `innerRadius` | number(0-1) | 0.8 | 内半径 |
| `outerRadius` | number(0-1) | 0.8 | 外半径 |
| `startAngle`/`endAngle` | number | — | 起止角 |
| `autoSort` | boolean | true | 自动排序 |
| `filterNegativeNumbers` | boolean | true | 过滤负值 |
| `legend` | boolean\|object | position 默认 `'right'` | |
| `tooltip` | boolean\|object | — | |
| `label` | boolean\|object | false | |
| `colors` | 色板 | — | |

## 示例

```tsx
const data: PieSeries[] = [
  { name: '流量来源', data: [['直接访问', 335], ['搜索引擎', 289], ['社交媒体', 200], ['其它', 148]] },
];

// 饼图
<Pie data={data} config={{ label: true }} height={320} />

// 环形图
<Pie data={data} config={{ cycle: true, innerRadius: 0.6, label: true }} height={320} />
```

## 陷阱
- 环形不要找 `<Donut>`/`<Ring>`（不存在），用 `config.cycle:true`。
- 玫瑰图（半径编码值）用独立组件 `<Nightingale>`，不是 Pie 的配置。
