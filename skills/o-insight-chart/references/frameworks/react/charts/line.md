# Line — 折线图

展示随时间/有序类别的趋势。支持面积、堆叠、平滑、双 Y 轴。

## API

```tsx
import { Line } from '@alicloud/cloud-charts-react';
import type { LineSeries, LineChartConfig } from '@alicloud/cloud-charts-core';
```

## data 形状

```ts
interface LineSeries {
  name: string;
  data: Array<[x, y]>;      // 时间序列用时间戳(number)；分类用字符串
  yAxis?: number;           // 双轴索引 0 | 1
  visible?: boolean;
}
```

## config 字段

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `area` | boolean | false | 面积图 |
| `stack` | boolean | false | 堆叠 |
| `spline` | boolean | false | 平滑曲线 |
| `step` | string\|boolean\|null | null | 阶梯线 |
| `symbol` | boolean\|object | false | 数据点 |
| `xAxis` | object\|false | type 默认 `'time'` | 轴类型 `'time'`/`'cat'`/`'value'` |
| `yAxis` | object\|object[]\|false | — | **数组=双 Y 轴** |
| `legend`/`tooltip` | boolean\|object | — | |
| `label` | boolean\|object | false | |
| `grid` | boolean | false | |
| `zoom`/`slider`/`scrollbar` | — | — | 大数据量交互 |
| `lineWidth` | number | — | 线宽 |
| `colors`/`areaColors` | 色板 | — | |

## 示例

```tsx
// 时间序列：时间戳 + time 轴（Line 默认即 time）
const H = 3600_000, T0 = new Date('2026-07-01T00:00:00').getTime();
const data: LineSeries[] = [
  { name: '今日', data: Array.from({ length: 24 }, (_, i) => [T0 + i * H, Math.round(Math.sin(i / 3) * 30 + 120)]) },
];
<Line data={data} config={{ xAxis: { type: 'time', mask: 'auto' } }} height={320} />

// 分类 x
<Line data={[{ name: 'PV', data: [['周一', 10], ['周二', 22], ['周三', 18]] }]}
      config={{ xAxis: { type: 'point' }, spline: true }} height={300} />

// 面积
<Line data={data} config={{ area: true }} />

// 双 Y 轴
const dual: LineSeries[] = [
  { name: '销量', yAxis: 0, data: [[T0, 100], [T0 + H, 120]] },
  { name: '转化率', yAxis: 1, data: [[T0, 0.2], [T0 + H, 0.25]] },
];
<Line data={dual} config={{ yAxis: [{}, {}] }} />
```

## 陷阱
- **字符串日期 x 会塌成一个点**——必须用时间戳 + `type:'time'`，或分类用 `type:'cat'`。
- 面积图不要找 `<Area>`（不存在），用 `config.area:true`。
