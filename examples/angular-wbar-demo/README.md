# Angular Wbar Demo

`@alicloud/cloud-charts-bar` 在 Angular 17+ standalone component 中的最小集成示例。

## 安装

```bash
npm install @alicloud/cloud-charts-bar @alicloud/cloud-charts-core --registry=https://registry.npmjs.org
```

> `@antv/g2` 已是 `@alicloud/cloud-charts-core` 的 dependencies，**无需手动安装 G2**。

## 启动

```bash
cd examples/angular-wbar-demo
npm install
npm run dev   # http://localhost:5182
```

> 本 demo 直接消费 npm 上发布的 `@alicloud/cloud-charts-{core,bar}@1.0.0-alpha.3`，与真实用户使用方式完全一致。

## 极简集成（零 G2 import）

```ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {
  renderWbarModel,
  type BarSeries,
  type BarChartConfig,
  type WbarModelInstance,
} from '@alicloud/cloud-charts-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<div #container style="width:100%;height:300px"></div>`,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  private instance?: WbarModelInstance<any>;

  ngAfterViewInit() {
    this.instance = renderWbarModel({
      container: this.container.nativeElement,
      data: [
        { name: '机房A', data: [['周一', 4092], ['周二', 1592], ['周三', 3714]] },
        { name: '机房B', data: [['周一', 6051], ['周二', 3278], ['周三', 5175]] },
      ],
      config: { stack: true, grid: true } satisfies BarChartConfig,
    });
  }

  ngOnDestroy() {
    this.instance?.chart.destroy();
  }
}
```

**完全不需要 import `@antv/g2`、不需要手写 `g2Renderer`**。cloud-core 在模块加载时已自动注册 `shape.break` 自定义形状，`renderWbarModel` 缺省 `renderer` 时使用内置默认渲染器。

## 完整示例（基础 + 断轴 6 个用例）

本 demo 同屏渲染了 6 个图（3 个基础 + 3 个 Y 轴断轴），完整代码见
[src/app/app.component.ts](./src/app/app.component.ts)。核心片段：

```ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {
  renderWbarModel,
  type BarChartConfig,
  type BarSeries,
  type WbarModelInstance,
} from '@alicloud/cloud-charts-bar';
import type { G2ChartLike } from '@alicloud/cloud-charts-core';

@Component({ /* ... */ })
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('basicContainer', { static: true }) basicContainer!: ElementRef<HTMLDivElement>;
  // ... 其余 ViewChild
  private instances: WbarModelInstance<G2ChartLike>[] = [];

  ngAfterViewInit() {
    const baseCases: Array<[ElementRef<HTMLDivElement>, BarSeries[], BarChartConfig]> = [
      [this.basicContainer, sampleData, {}],
      [this.stackContainer, sampleData, { stack: true }],
      [this.gridContainer,  sampleData, { grid: true }],

      // —— Y 轴断轴（G2 5.4+ 新特性）——
      [this.singleBreakContainer, breakData, {
        animate: false,
        yAxis: {
          title: false,
          breaks: [{ start: 6000, end: 100000, gap: 0.05 }],
        },
      }],
      [this.doubleBreakContainer, breakData, {
        animate: false,
        yAxis: {
          title: false,
          breaks: [
            { start: 6000, end: 100000, gap: 0.05 },
            { start: 105000, end: 4100000, gap: 0.05, vertices: 60, verticeOffset: 4, compress: 'end' },
          ],
        },
      }],
    ];
    for (const [ref, data, config] of baseCases) {
      this.instances.push(renderWbarModel({ container: ref.nativeElement, data, config }));
    }
  }

  ngOnDestroy() {
    this.instances.forEach((inst) => inst.chart.destroy());
    this.instances = [];
  }
}
```

`G2ChartLike` 是 `@alicloud/cloud-charts-core` 提供的轻量结构类型（仅声明 `options/render/destroy/...`），
用于给 `WbarModelInstance<TChart>` 的泛型 `chart` 字段一个类型 — 不会引入 `@antv/g2` 运行时依赖。

## 自定义渲染器（可选，高级用法）

只在你需要切换 G2 主题、关闭 autoFit、或换用其他 G2 适配实现时才需要：

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

## 与 React/Solid demo 对比

| 项 | React | Solid | Angular |
|----|-------|-------|---------|
| 包入口 | `@alicloud/cloud-charts-react` | `@alicloud/cloud-charts-solid` | `@alicloud/cloud-charts-bar`（直接） |
| 组件挂载 | `<Bar data={data} />` | `<Bar data={data} />` | `renderWbarModel({ container, data })` |
| 生命周期 | `useEffect` 自动 | `createEffect` 自动 | `ngAfterViewInit` 手动 |
| 销毁 | `useEffect` cleanup | `onCleanup` | `ngOnDestroy` |

Angular 没有 React/Solid 那种适配层 — 直接用 vanilla `renderWbarModel`，因为 Angular 的 ChangeDetection 与 G2 的 update 周期完全独立，硬包一层只会增加复杂度。
