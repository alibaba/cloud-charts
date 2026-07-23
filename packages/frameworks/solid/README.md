# @alicloud/cloud-charts-solid

> SolidJS 1.8+ 适配组件库。封装 `@alicloud/cloud-charts-{bar,pie}` 的 vanilla runtime，提供 `<Bar />` / `<Pie />` Solid 组件。

## 适用场景

✅ **推荐使用 `@alicloud/cloud-charts-solid`**：
- 全新 SolidJS 项目
- 需要 `createSignal` / `createEffect` 心智模型，自动响应数据变化
- 提供 `mountBar` / `mountPie` 等 vanilla 挂载函数，可在非 Solid 场景内嵌使用

❌ **不推荐**：
- React / Angular / Vue 项目 → 用对应框架的适配包
- 原生 JS 项目 → 直接用 `@alicloud/cloud-charts-bar` / `@alicloud/cloud-charts-line` / `@alicloud/cloud-charts-pie`

## 安装

```bash
npm install @alicloud/cloud-charts-solid @alicloud/cloud-charts-core --registry=https://registry.npmjs.org
```

> `@antv/g2` 已是 `@alicloud/cloud-charts-core` 的 dependencies，**无需额外安装**。
>
> ⚠️ 当前版本（alpha）尚未正式 publish 到 npm，开发期请通过 monorepo workspace 使用；
> 正式版会在 cloud-bar / cloud-line 验证完毕后跟进发布。

## 快速开始

```tsx
import { ChartProvider, Bar, Pie } from '@alicloud/cloud-charts-solid';

const data = [
  { name: '机房A', data: [['周一', 4092], ['周二', 1592]] },
  { name: '机房B', data: [['周一', 6051], ['周二', 3278]] },
];

function Dashboard() {
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
  // SolidJS 组件
  Bar,
  Pie,
  ChartProvider,
  useChartProvider,
  // 直接挂载（非 Solid 环境）
  mountBar,
  mountPie,
  // 默认 G2 5 spec renderer
  g2Renderer,
  // 类型
  type BarProps,
  type PieProps,
} from '@alicloud/cloud-charts-solid';
```

## `mountBar` / `mountPie`：在 React / Vue / 原生 JS 中嵌入

`mountXxx` 是 vanilla 函数，不依赖 Solid runtime 是否在外层运行：

```ts
import { mountBar } from '@alicloud/cloud-charts-solid';

const container = document.getElementById('app')!;
const instance = mountBar(container, data, { stack: true });

// 更新数据
instance.update(newData, newConfig);

// 销毁
instance.destroy();
```

> 注：`mountXxx` 会内部启动一个 Solid 微环境，单独管理响应式更新。

## 与旧版对比

`@alicloud/cloud-charts-solid` 是全新发布，无旧版可对比。它和 `@alicloud/cloud-charts-react` 是平级的"React 适配包"对应物：

| 包 | 框架 | 组件入口 |
|----|------|---------|
| `@alicloud/cloud-charts-react` | React 17/18/19 | `import { Bar, Pie } from '@alicloud/cloud-charts-react'` |
| `@alicloud/cloud-charts-solid` | SolidJS 1.8+ | `import { Bar, Pie } from '@alicloud/cloud-charts-solid'` |
| `@alicloud/cloud-charts-bar` | 原生 / Angular / Vue | `import { renderWbarModel } from '@alicloud/cloud-charts-bar'` |

## 完整 demo

[examples/solid-demo](https://github.com/alibaba/cloud-charts/tree/refactor/ai-v2-migration/examples/solid-demo)

## 版本与发布

- 当前版本：`1.0.0-alpha.0`（待发布）
- Registry：`https://registry.npmjs.org`
- Tag：`alpha`

## License

MIT
