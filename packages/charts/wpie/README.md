# @alicloud/cloud-charts-pie

> 框架无关的饼图 / 环图渲染包。Angular / Vue / 原生 JS 项目均可使用，由 G2 5.4 驱动。

## 适用场景

✅ **推荐使用 `@alicloud/cloud-charts-pie`**：
- Angular 17+ 项目
- Vue 3 项目
- 原生 JS / TypeScript 项目
- 任何非 React 项目

❌ **不推荐**：
- React 项目 → 用 `@alicloud/cloud-charts-react`，提供 `<Pie />` 组件
- SolidJS 项目 → 用 `@alicloud/cloud-charts-solid`，提供 `<Pie />` 组件

## 安装

```bash
npm install @alicloud/cloud-charts-pie @alicloud/cloud-charts-core --registry=https://registry.npmjs.org
```

> `@antv/g2` 已是 `@alicloud/cloud-charts-core` 的 dependencies，**无需额外安装**。
>
> ⚠️ 当前版本（alpha）尚未正式 publish 到 npm，开发期请通过 monorepo workspace 使用；
> 正式版会在 cloud-bar / cloud-line 验证完毕后跟进发布。

## 快速开始（vanilla JS）

```ts
import { Chart } from '@antv/g2';
import * as G2 from '@antv/g2';
import { customAxisBreaksShape, type G2SpecRenderer } from '@alicloud/cloud-charts-core';
import { renderWpieModel } from '@alicloud/cloud-charts-pie';

(G2 as any).register?.('shape.break', customAxisBreaksShape);

const g2Renderer: G2SpecRenderer<Chart> = {
  createChart: (c) => new Chart({ container: c, autoFit: true }),
  applySpec: (chart, spec) => (chart as any).options(spec),
  destroyChart: (chart) => chart.destroy(),
};

const { chart } = renderWpieModel({
  container: document.getElementById('app')!,
  renderer: g2Renderer,
  data: [
    {
      name: '浏览器占比',
      data: [
        ['Firefox', 45.0],
        ['IE', 26.8],
        ['Chrome', 12.8],
        ['Safari', 8.5],
        ['Opera', 6.2],
        ['Others', 0.7],
      ],
    },
  ],
  config: {
    cycle: true,         // 环图
    innerRadius: 0.6,
  },
});
```

## 数据格式

```ts
type PieSeries = {
  name: string;                              // 系列名（饼图通常只有 1 个系列）
  data: Array<[string, number]>;             // [分类, 数值]
};
```

## PieChartConfig 配置项速查

| 字段 | 类型 | 说明 |
|------|------|------|
| `cycle` | boolean | 是否环图（中空） |
| `innerRadius` | number | 内圆半径占比（0-1） |
| `outerRadius` | number | 外圆半径占比（0-1） |
| `startAngle` | number | 起始角度（弧度，半圆饼图常用 `-Math.PI`） |
| `endAngle` | number | 结束角度（半圆饼图常用 `0`） |
| `legend` | object \| boolean | 图例 |
| `tooltip` | object \| boolean | 提示框 |
| `colors` | string[] | 颜色序列 |
| `label` | object \| boolean | 数据标签 |

## 主要导出

```ts
import {
  renderWpie,
  renderWpieModel,
  type PieSeries,
  type PieChartConfig,
  type WpieModelInstance,
} from '@alicloud/cloud-charts-pie';
```

## 版本与发布

- 当前版本：`1.0.0-alpha.0`（待发布）
- Registry：`https://registry.npmjs.org`
- Tag：`alpha`

## License

MIT
