# @alicloud/cloud-charts-core

> 框架无关的图表运行时核心，由 G2 5.4 驱动。`@alicloud/cloud-charts-bar` / `@alicloud/cloud-charts-line` 等所有图表包都依赖它。

## 适用场景

- **作为 cloud-bar / cloud-line 的依赖**：你装任何一个图表包时 npm 会把 cloud-core 一起拉下来，**正常使用不需要直接 import**。
- **二次开发 / 高级用例**：自定义 G2 spec 渲染器（例如关掉 autoFit、切换 G2 主题）、注册 legacy 交互（hover 联动 / click 过滤 / brush zoom）、注册自定义 G2 shape。
- **类型扩展**：从 `@alicloud/cloud-charts-core` 直接 re-export G2 5 真实类型（`LegendCategoryOptions` / `AxisOptions` / `G2Spec` 等），IDE 智能提示直达 `node_modules/@antv/g2/lib/...d.ts`。

> 不直接渲染图表 — 渲染由 cloud-bar / cloud-line 提供。

## 安装

```bash
npm install @alicloud/cloud-charts-core --registry=https://registry.anpm.alibaba-inc.com
```

`@antv/g2 ~5.4.8` / `@antv/component ^2.1.9` 已是本包的 `dependencies`，**自动随 cloud-core 安装**，用户无需手动声明。

## 内置默认渲染器（推荐用法）

cloud-core 内置一个 G2 5 默认 spec 渲染器 `defaultG2Renderer`，**模块加载时自动注册 `shape.break` 自定义形状**。`cloud-bar` / `cloud-line` 的 `renderXxxModel({ renderer })` 参数缺省时会自动使用它。

```ts
// 业务侧不需要 import 任何 @antv/g2，这是 cloud-bar 完整的最简调用：
import { renderWbarModel } from '@alicloud/cloud-charts-bar';

renderWbarModel({
  container: document.getElementById('app')!,
  data: [...],
  config: { stack: true },
});
```

## 自定义渲染器（高级用法）

如果需要关闭 autoFit、切换 G2 主题、或换用其他 G2 适配实现，可自己实现 `G2SpecRenderer`：

```ts
import { Chart } from '@antv/g2';
import type { G2SpecRenderer } from '@alicloud/cloud-charts-core';

const myRenderer: G2SpecRenderer<Chart> = {
  createChart: (c) => new Chart({ container: c, autoFit: false, theme: 'classicDark' }),
  applySpec: (chart, spec) => (chart as any).options(spec),
  destroyChart: (chart) => chart.destroy(),
};

renderWbarModel({ container, renderer: myRenderer, data, config });
```

## 主要导出

```ts
import {
  // —— 默认 G2 5 渲染器（自动注册断轴 shape；推荐缺省使用）——
  defaultG2Renderer,
  type G2ChartLike,

  // —— Spec 渲染抽象 ——
  type G2SpecRenderer,
  type ChartSpec,

  // —— 自定义 G2 5 形状 ——
  customAxisBreaksShape,

  // —— Legacy 交互注册 ——
  registerLegacyInteractions,

  // —— 主题 token ——
  resolveTheme,
  createG2Theme,

  // —— G2 5 真实类型 re-export ——
  type LegendCategorySpec,
  type AxisSpec,
} from '@alicloud/cloud-charts-core';
```

完整导出见 `dist/index.d.ts`。

## 与其他 cloud-* 包的关系

```
              @alicloud/cloud-charts-core
                 ▲      ▲
                 │      │
     ┌───────────┴──────┴───────────┐
     │                              │
@alicloud/cloud-charts-bar              @alicloud/cloud-charts-line
（柱状/条形图）                  （折线/面积图）
```

## 版本与发布

- 当前版本：`1.0.0-alpha.3`
- Registry：`https://registry.anpm.alibaba-inc.com`
- Tag：`alpha`

## License

MIT
