# @alicloud/cloud-charts-react

> React 17 / 18 / 19 适配组件库。封装 `@alicloud/cloud-charts-{bar,pie}` 的 vanilla runtime，提供符合 React 心智的 `<Bar />` / `<Pie />` 组件。

## 适用场景

✅ **推荐使用 `@alicloud/cloud-charts-react`**：
- 全新 React 项目
- 使用 React Hooks 心智模型，需要 props-driven 数据更新
- 需要 `<ChartProvider>` 统一注入主题 / 语言 / G2 实例配置

❌ **不推荐**：
- Angular / Vue / 原生 JS 项目 → 用 `@alicloud/cloud-charts-bar` / `@alicloud/cloud-charts-line` / `@alicloud/cloud-charts-pie`
- SolidJS 项目 → 用 `@alicloud/cloud-charts-solid`
- 旧 React 项目（已用 `@alicloud/cloud-charts`）→ 走 `@alicloud/cloud-charts` 的 0 改动升级路径

## 安装

```bash
npm install @alicloud/cloud-charts-react @alicloud/cloud-charts-core --registry=https://registry.npmjs.org
```

> `@antv/g2` 已是 `@alicloud/cloud-charts-core` 的 dependencies，**无需额外安装**。
>
> ⚠️ 当前版本（alpha）尚未正式 publish 到 npm，开发期请通过 monorepo workspace 使用；
> 正式版会在 cloud-bar / cloud-line 验证完毕后跟进发布。

## 快速开始

```tsx
import { ChartProvider, Bar, Pie } from '@alicloud/cloud-charts-react';

const data = [
  { name: '机房A', data: [['周一', 4092], ['周二', 1592]] },
  { name: '机房B', data: [['周一', 6051], ['周二', 3278]] },
];

export function Dashboard() {
  return (
    <ChartProvider language="zh-CN" theme="normal">
      <Bar height={300} data={data} config={{ stack: true, grid: true }} />
      <Pie height={300} data={[{ name: '占比', data: [['Firefox', 45], ['Chrome', 30]] }]} />
    </ChartProvider>
  );
}
```

## 主要导出

```ts
import {
  // 组件
  Bar,
  Pie,
  // Provider（注入 theme / language）
  ChartProvider,
  useChartProvider,
  // 自定义 Hook
  useChart,
  // 默认 G2 5 spec renderer
  g2Renderer,
  // 类型
  type BarProps,
  type PieProps,
  type ChartProviderProps,
} from '@alicloud/cloud-charts-react';
```

## `<Bar />` 完整 props

```ts
type BarProps = {
  data: BarSeries[];
  config?: BarChartConfig;
  height?: number | string;
  width?: number | string;
  language?: 'zh-CN' | 'en-US';
  theme?: 'normal' | 'dark' | 'yunxiao';
  onMount?: (chart: Chart) => void;          // 渲染完成回调，可访问底层 G2 chart
  onDestroy?: () => void;
};
```

## 自定义 Renderer / 切换 G2 版本

如果需要用自己的 G2 实例（例如不同子页用不同 G2 主题），可以通过 `<ChartProvider renderer={...}>` 注入：

```tsx
import { Chart } from '@antv/g2';
import { ChartProvider, Bar } from '@alicloud/cloud-charts-react';
import { customAxisBreaksShape, type G2SpecRenderer } from '@alicloud/cloud-charts-core';
import * as G2 from '@antv/g2';

(G2 as any).register?.('shape.break', customAxisBreaksShape);

const myRenderer: G2SpecRenderer<Chart> = {
  createChart: (c) => new Chart({ container: c, autoFit: true, theme: 'classicDark' }),
  applySpec: (chart, spec) => (chart as any).options(spec),
  destroyChart: (chart) => chart.destroy(),
};

<ChartProvider renderer={myRenderer}>
  <Bar data={data} />
</ChartProvider>;
```

## useChart Hook（高级用法）

如果你有不在导出列表里的图表类型，可以直接用底层 hook：

```tsx
import { useChart } from '@alicloud/cloud-charts-react';
import { renderWbarModel } from '@alicloud/cloud-charts-bar';

function CustomBar({ data, config }: { data: any; config: any }) {
  const ref = useChart({
    render: ({ container, renderer }) =>
      renderWbarModel({ container, renderer, data, config }),
    deps: [data, config],
  });
  return <div ref={ref} style={{ width: '100%', height: 300 }} />;
}
```

## 与旧 `@alicloud/cloud-charts` 对比

| 项 | 旧 `@alicloud/cloud-charts` | 新 `@alicloud/cloud-charts-react` |
|----|--------------------------|--------------------------|
| 包大小 | 单包 559 KB gz（强绑 React） | core 44 KB gz + 单图表 0.5 KB gz |
| 数据流 | 状态嵌入组件树 | props-driven，更符合 React 心智 |
| G2 版本 | v4 | v5.4（spec mode + interaction.tooltip） |
| API | `<Wbar />` `<Wline />` `<Wpie />` | `<Bar />` `<Line />` `<Pie />` |
| 适配框架 | 仅 React | 同 runtime 多框架（vanilla / Angular / Vue / Solid） |

## 版本与发布

- 当前版本：`1.0.0-alpha.0`（待发布）
- Registry：`https://registry.npmjs.org`
- Tag：`alpha`

## License

MIT
