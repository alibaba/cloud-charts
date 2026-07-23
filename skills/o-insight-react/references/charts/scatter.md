# Scatter — 散点图 / 气泡图

展示两个数值变量的相关性。第三元组元素驱动气泡大小。

## API

```tsx
import { Scatter } from '@alicloud/cloud-charts-react';
import type { ScatterSeries, ScatterChartConfig } from '@alicloud/cloud-charts-core';
```

## data 形状

```ts
interface ScatterSeries {
  name: string;
  data: Array<[x, y, size?]>;   // 第三元素可选：有则作气泡大小
  visible?: boolean;
}
```

## config 字段

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `jitter` | boolean | false | 抖动（分类重叠时打散） |
| `shape` | string | — | 点形状 |
| `symbol` | boolean | true | 显示点 |
| `xAxis`/`yAxis` | object\|false | — | |
| `legend`/`tooltip` | boolean\|object | — | |
| `label` | boolean\|object | false | |

## 示例

```tsx
// 散点（相关性）
const data: ScatterSeries[] = [
  { name: '男性', data: [[161, 51], [167, 59], [170, 64]] },
  { name: '女性', data: [[155, 47], [160, 52], [163, 55]] },
];
<Scatter data={data} config={{ tooltip: true }} height={360} />

// 气泡（第三维=大小）
const bubble: ScatterSeries[] = [
  { name: '城市', data: [[120, 800, 30], [90, 600, 18], [150, 950, 45]] },
];
<Scatter data={bubble} height={360} />
```

## 陷阱
- 大量重叠点用 `jitter:true` 或改用 `<Hexagonal>`（hex-bin 密度）。
