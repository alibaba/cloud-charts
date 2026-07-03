# @alicloud/cloud-charts-line

> 框架无关的折线图 / 面积图渲染包。Angular / Vue / 原生 JS 项目均可使用，由 G2 5.4 驱动。

## 适用场景

✅ **推荐使用 `@alicloud/cloud-charts-line`**：
- Angular 17+ 项目
- Vue 3 项目
- 原生 JS / TypeScript 项目
- 任何非 React 项目

❌ **不推荐**：
- React 项目 → 用 `@alicloud/cloud-charts-react`（Line 适配尚未发布，预计随后续 minor 跟进）
- SolidJS 项目 → 用 `@alicloud/cloud-charts-solid`（同上）

## 安装

```bash
npm install @alicloud/cloud-charts-line @alicloud/cloud-charts-core --registry=https://registry.anpm.alibaba-inc.com
```

> `@antv/g2` 已是 `@alicloud/cloud-charts-core` 的 dependencies，**无需额外安装**。

## 快速开始（零 G2 import）

```ts
import { renderWlineModel } from '@alicloud/cloud-charts-line';

const baseTs = new Date('2026-06-21T00:00:00').getTime();
const HOUR_MS = 3600 * 1000;

const { chart } = renderWlineModel({
  container: document.getElementById('app')!,
  data: [
    {
      name: 'CPU',
      data: [
        [baseTs + 0 * HOUR_MS, 32],
        [baseTs + 4 * HOUR_MS, 41],
        [baseTs + 8 * HOUR_MS, 56],
      ],
    },
  ],
  config: { area: true, spline: true },
});
```

> 不传 `renderer` 时自动使用 cloud-core 内置的 G2 5 默认渲染器（autoFit + 已注册断轴 shape）。
> 如果需要自定义 G2 主题 / 关闭 autoFit / 换用其他 G2 适配，可显式传 `renderer`，
> 见 [@alicloud/cloud-charts-core README — 自定义渲染器](../../core/README.md)。

## Angular 17+ 集成

完整 demo：[examples/angular-wline-demo](https://github.com/alibaba/cloud-charts/tree/refactor/ai-v2-migration/examples/angular-wline-demo)

```ts
import { Component, ElementRef, ViewChild, Input, AfterViewInit, OnDestroy } from '@angular/core';
import {
  renderWlineModel,
  type LineSeries,
  type LineChartConfig,
  type WlineModelInstance,
} from '@alicloud/cloud-charts-line';

@Component({
  selector: 'aisc-wline',
  standalone: true,
  template: `<div #container style="width:100%;height:300px"></div>`,
})
export class AiscWlineComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  @Input() data: LineSeries[] = [];
  @Input() config: LineChartConfig = {};
  private instance?: WlineModelInstance<any>;

  ngAfterViewInit() {
    this.instance = renderWlineModel({
      container: this.container.nativeElement,
      data: this.data,
      config: this.config,
    });
  }

  ngOnDestroy() {
    this.instance?.chart.destroy();
  }
}
```

## 数据格式

```ts
type LineSeries = {
  name: string;                          // 系列名（用于 legend）
  data: Array<[number, number]>;         // [时间戳(毫秒) | x 值, y 值]
  yAxis?: 0 | 1;                         // 双轴时指定挂哪条 Y 轴
};
```

> ⚠️ **X 轴默认是 `time` 类型，必须传毫秒时间戳数字（`Date.getTime()` 的返回值）**。
> 如果 X 轴是分类（"周一/周二"等），请传 `config.xAxis = { type: 'band' }` 并使用 `[string, number]`。

## LineChartConfig 配置项速查

| 字段 | 类型 | 说明 |
|------|------|------|
| `area` | boolean | 显示面积 |
| `stack` | boolean | 多系列堆叠 |
| `spline` | boolean | 平滑曲线 |
| `step` | boolean | 阶梯线 |
| `symbol` | boolean | 数据点标记 |
| `xAxis` | object \| false | X 轴（type/mask/grid/labelFormatter/...） |
| `yAxis` | object \| object[] \| false | Y 轴（双轴传数组） |
| `legend` | object \| boolean | 图例 |
| `tooltip` | object \| boolean | 提示框 |
| `guide` | object | 辅助线 / 区域 |
| `zoom` | boolean | 拖拽缩放 |
| `slider` | object \| boolean | 缩略轴 |
| `colors` | string[] | 颜色序列 |

完整字段见 `dist/index.d.ts`。

## 断轴（G2 5.4+ 新特性）

```ts
config: LineChartConfig = {
  yAxis: {
    breaks: [
      {
        gap: 0.05,             // 视觉间距占比
        vertices: [200, 1000], // 断点起止
        verticeOffset: 30,     // 断点偏移
        compress: 'end',       // 压缩在终点
      },
    ],
  },
};
```

> cloud-core 已在模块加载时自动注册 `shape.break`，业务侧无需任何额外配置。

## 主要导出

```ts
import {
  renderWline,
  renderWlineModel,
  type LineSeries,
  type LineChartConfig,
  type WlineModelInstance,
} from '@alicloud/cloud-charts-line';
```

## 版本与发布

- 当前版本：`1.0.0-alpha.3`
- Registry：`https://registry.anpm.alibaba-inc.com`
- Tag：`alpha`

## License

MIT
