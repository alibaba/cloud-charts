# Angular Wline Demo

`@alicloud/cloud-charts-line` 在 Angular 17+ standalone component 中的使用示例。

## 安装

```bash
npm install @alicloud/cloud-charts-line @alicloud/cloud-charts-core --registry=https://registry.npmjs.org
```

> `@antv/g2` 已是 `@alicloud/cloud-charts-core` 的 dependencies，**无需手动安装 G2**。

`@alicloud/cloud-charts-bar` / `@alicloud/cloud-charts-pie` 等也都是相同的接入模式，本 demo 演示折线图。

## 极简集成（零 G2 import）

直接封装一个可复用的 Angular 组件：

```ts
import {
  Component, ElementRef, ViewChild, Input, AfterViewInit, OnChanges, OnDestroy, SimpleChanges,
} from '@angular/core';
import {
  renderWlineModel,
  type LineSeries,
  type LineChartConfig,
  type WlineModelInstance,
} from '@alicloud/cloud-charts-line';

@Component({
  selector: 'cloud-charts-wline',
  standalone: true,
  template: `<div #container [style.width]="width" [style.height]="heightStr"></div>`,
})
export class CloudChartsWlineComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  @Input() data: LineSeries[] = [];
  @Input() config: LineChartConfig = {};
  @Input() width: string | number = '100%';
  @Input() height: string | number = 300;

  private instance?: WlineModelInstance<any>;

  get heightStr() {
    return typeof this.height === 'number' ? `${this.height}px` : this.height;
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['data'] && !changes['data'].firstChange) ||
        (changes['config'] && !changes['config'].firstChange)) {
      this.instance?.chart.destroy();
      this.render();
    }
  }

  ngOnDestroy() {
    this.instance?.chart.destroy();
    this.instance = undefined;
  }

  private render() {
    if (!this.container) return;
    this.instance = renderWlineModel({
      container: this.container.nativeElement,
      data: this.data,
      config: this.config,
    });
  }
}
```

**完全不需要 import `@antv/g2`、不需要手写 `g2Renderer`**。cloud-core 在模块加载时已自动注册 `shape.break` 自定义形状，`renderWlineModel` 缺省 `renderer` 时使用内置默认渲染器。

## 业务侧使用

```ts
import { Component } from '@angular/core';
import { CloudChartsWlineComponent } from './cloud-charts-wline.component';
import type { LineSeries, LineChartConfig } from '@alicloud/cloud-charts-line';

@Component({
  selector: 'app-cpu-monitor',
  standalone: true,
  imports: [CloudChartsWlineComponent],
  template: `
    <cloud-charts-wline [data]="data" [config]="config" height="320"></cloud-charts-wline>
  `,
})
export class CpuMonitorComponent {
  data: LineSeries[] = [
    { name: 'CPU', data: [['2026-06-21 00:00', 32], ['2026-06-21 04:00', 41]] },
    { name: '内存', data: [['2026-06-21 00:00', 45], ['2026-06-21 04:00', 52]] },
  ];
  config: LineChartConfig = { area: true };
}
```

## 数据格式

```ts
type LineSeries = {
  name: string;                                      // 系列名（用于 legend）
  data: Array<[number, number]>;                     // [时间戳(毫秒), y 值]
};

const data: LineSeries[] = [
  { name: 'CPU',  data: [[1719331200000, 32], [1719345600000, 41]] },
  { name: '内存', data: [[1719331200000, 45], [1719345600000, 52]] },
];
```

> ⚠️ **X 轴默认是 `time` 类型，必须传毫秒时间戳数字（`Date.getTime()` 的返回值）**，
> 不要传 `'2026-06-21 00:00'` 这样的字符串 — 否则所有点会重叠在一个位置。
>
> ```ts
> // 推荐写法
> const baseTs = new Date('2026-06-21T00:00:00').getTime();
> const HOUR_MS = 3600 * 1000;
> const data: LineSeries[] = [{
>   name: 'CPU',
>   data: [
>     [baseTs + 0 * HOUR_MS, 32],
>     [baseTs + 4 * HOUR_MS, 41],
>     // ...
>   ],
> }];
> ```

如果 X 轴是分类型（如「周一/周二/周三」），切换为 band 轴：

```ts
config: LineChartConfig = { xAxis: { type: 'band' } };
const data: LineSeries[] = [{
  name: 'CPU',
  data: [['周一', 32], ['周二', 41]],
}];
```

## 配置项速查（LineChartConfig）

| 字段 | 类型 | 说明 |
|------|------|------|
| `area` | boolean | 是否显示面积 |
| `stack` | boolean | 是否堆叠（多系列） |
| `spline` | boolean | 平滑曲线 |
| `step` | boolean | 阶梯线 |
| `symbol` | boolean | 数据点标记 |
| `xAxis` | object \| false | X 轴配置（type/mask/grid/labelFormatter/...） |
| `yAxis` | object \| object[] \| false | Y 轴配置（双轴传数组） |
| `legend` | object \| boolean | 图例配置（visible/position/showData/...） |
| `tooltip` | object \| boolean | 提示框配置（formatter/lockable/...） |
| `guide` | object | 辅助线/区域 |
| `zoom` | boolean | 拖拽缩放 |
| `slider` | object \| boolean | 缩略轴 |
| `colors` | string[] | 颜色序列 |

完整配置见 `packages/core/src/model/lineDefaultConfig.ts`。

## 自定义渲染器（可选，高级用法）

只在需要切换 G2 主题、关闭 autoFit、或换用其他 G2 适配时才需要：

```ts
import { Chart } from '@antv/g2';
import type { G2SpecRenderer } from '@alicloud/cloud-charts-core';

const myRenderer: G2SpecRenderer<Chart> = {
  createChart: (c) => new Chart({ container: c, autoFit: false, theme: 'classicDark' }),
  applySpec: (chart, spec) => (chart as any).options(spec),
  destroyChart: (chart) => chart.destroy(),
};

renderWlineModel({ container, renderer: myRenderer, data, config });
```

## 启动 demo

```bash
cd examples/angular-wline-demo
npm install
npm run dev   # http://localhost:5183
```

或在仓库根目录：

```bash
npm run dev:angular-wline
```

## 与 wbar 的差异

唯一区别是包名和 model 函数：

| 图表 | 包 | render 函数 | data 类型 | config 类型 |
|------|----|----|------|------|
| 折线 | `@alicloud/cloud-charts-line` | `renderWlineModel` | `LineSeries[]` | `LineChartConfig` |
| 柱状 | `@alicloud/cloud-charts-bar` | `renderWbarModel` | `BarSeries[]` | `BarChartConfig` |
