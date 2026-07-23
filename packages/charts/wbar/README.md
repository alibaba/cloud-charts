# @alicloud/cloud-charts-bar

> 框架无关的柱状图 / 条形图渲染包。Angular / Vue / 原生 JS 项目均可使用，由 G2 5.4 驱动。

## 适用场景

✅ **推荐使用 `@alicloud/cloud-charts-bar`**：
- Angular 17+ 项目（standalone component / 模块化均可）
- Vue 3 项目
- 原生 JS / TypeScript 项目
- 任何非 React 项目

❌ **不推荐**：
- React 项目 → 用 `@alicloud/cloud-charts-react`，提供更符合 React 心智的 `<Bar />` 组件
- SolidJS 项目 → 用 `@alicloud/cloud-charts-solid`

## 安装

```bash
npm install @alicloud/cloud-charts-bar @alicloud/cloud-charts-core --registry=https://registry.npmjs.org
```

> `@antv/g2` 已是 `@alicloud/cloud-charts-core` 的 dependencies，**无需额外安装**。

## 快速开始（零 G2 import）

```ts
import { renderWbarModel } from '@alicloud/cloud-charts-bar';

const container = document.getElementById('app')!;
const { chart } = renderWbarModel({
  container,
  data: [
    {
      name: '机房A',
      data: [['周一', 4092], ['周二', 1592], ['周三', 3714], ['周四', 4854]],
    },
    {
      name: '机房B',
      data: [['周一', 6051], ['周二', 3278], ['周三', 5175], ['周四', 6548]],
    },
  ],
  config: { stack: false, dodge: true, grid: true },
});

// 销毁
// chart.destroy();
```

> 不传 `renderer` 时自动使用 cloud-core 内置的 G2 5 默认渲染器（autoFit + 已注册断轴 shape）。
> 如果需要自定义 G2 主题 / 关闭 autoFit / 换用其他 G2 适配，可显式传 `renderer`，
> 见 [@alicloud/cloud-charts-core README — 自定义渲染器](../../core/README.md)。

## Angular 17+ 集成

```ts
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {
  renderWbarModel,
  type BarSeries,
  type BarChartConfig,
  type WbarModelInstance,
} from '@alicloud/cloud-charts-bar';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: `<div #container style="width:100%;height:300px"></div>`,
})
export class BarChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  private instance?: WbarModelInstance<any>;

  ngAfterViewInit() {
    this.instance = renderWbarModel({
      container: this.container.nativeElement,
      data: [/* BarSeries[] */],
      config: { stack: true } satisfies BarChartConfig,
    });
  }

  ngOnDestroy() {
    this.instance?.chart.destroy();
  }
}
```

完整 demo：[examples/angular-wbar-demo](https://github.com/alibaba/cloud-charts/tree/refactor/ai-v2-migration/examples/angular-wbar-demo)

## 数据格式

```ts
type BarSeries = {
  name: string;                                      // 系列名，用于 legend
  data: Array<[string, number]>;                     // [分类, y 值]
};

const data: BarSeries[] = [
  { name: '机房A', data: [['周一', 4092], ['周二', 1592]] },
  { name: '机房B', data: [['周一', 6051], ['周二', 3278]] },
];
```

## BarChartConfig 配置项速查

| 字段 | 类型 | 说明 |
|------|------|------|
| `stack` | boolean | 是否堆叠 |
| `dodge` | boolean | 是否分组（与 stack 互斥） |
| `percentage` | boolean | 百分比堆叠 |
| `polar` | boolean | 极坐标（玫瑰图） |
| `transpose` | boolean | 转为条形图 |
| `xAxis` | object \| false | X 轴（type/grid/labelFormatter/...） |
| `yAxis` | object \| object[] \| false | Y 轴（双轴传数组） |
| `legend` | object \| boolean | 图例 |
| `tooltip` | object \| boolean | 提示框 |
| `colors` | string[] | 颜色序列 |
| `grid` | boolean | 是否显示网格线 |

## 主要导出

```ts
import {
  renderWbar,        // 简化入口（不返回 model）
  renderWbarModel,   // 标准入口（返回 { chart, model }）
  type BarSeries,
  type BarChartConfig,
  type WbarModelInstance,
} from '@alicloud/cloud-charts-bar';
```

## 版本与发布

- 当前版本：`1.0.0-alpha.3`
- Registry：`https://registry.npmjs.org`
- Tag：`alpha`

## License

MIT
