import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  renderWlineModel,
  type LineChartConfig,
  type LineSeries,
  type WlineModelInstance,
} from '@alicloud/cloud-charts-line';
import type { G2ChartLike } from '@alicloud/cloud-charts-core';

// 数据来源：Storybook Y 轴断轴用例（G2 5.4+ 新特性）
// 4 个系列数值跨度极大（950 ~ 4,120,500），不开断轴时小系列被压成贴近 0 的直线
const breakData: LineSeries[] = [
  {
    name: 'Sports',
    data: [
      [1483372800000, 1800],
      [1483459200000, 2500],
      [1483545600000, 3100],
      [1483632000000, 4200],
      [1483718400000, 3890],
      [1483804800000, 5200],
      [1483891200000, 5600],
    ],
  },
  {
    name: 'Strategy',
    data: [
      [1483372800000, 950],
      [1483459200000, 1400],
      [1483545600000, 2200],
      [1483632000000, 1750],
      [1483718400000, 2800],
      [1483804800000, 3300],
      [1483891200000, 2900],
    ],
  },
  {
    name: 'Shooter',
    data: [
      [1483372800000, 101200],
      [1483459200000, 104800],
      [1483545600000, 102600],
      [1483632000000, 103500],
      [1483718400000, 104200],
      [1483804800000, 102900],
      [1483891200000, 103800],
    ],
  },
  {
    name: 'Other',
    data: [
      [1483372800000, 4120500],
      [1483459200000, 4107800],
      [1483545600000, 4112300],
      [1483632000000, 4109500],
      [1483718400000, 4115000],
      [1483804800000, 4111200],
      [1483891200000, 4108800],
    ],
  },
];

/**
 * 可复用的 CloudChartsWlineComponent — 推荐封装在你的项目共享模块中。
 * 使用：<cloud-charts-wline [data]="myData" [config]="{ area: true }" height="300"></cloud-charts-wline>
 */
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

  private instance?: WlineModelInstance<G2ChartLike>;

  get heightStr() {
    return typeof this.height === 'number' ? `${this.height}px` : this.height;
  }

  ngAfterViewInit() {
    this.instance = renderWlineModel({
      container: this.container.nativeElement,
      data: this.data,
      config: this.config,
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // data/config 变化时重渲染（简单实现：重建实例）
    if ((changes['data'] && !changes['data'].firstChange) || (changes['config'] && !changes['config'].firstChange)) {
      this.instance?.chart.destroy();
      if (this.container) {
        this.instance = renderWlineModel({
          container: this.container.nativeElement,
          data: this.data,
          config: this.config,
        });
      }
    }
  }

  ngOnDestroy() {
    this.instance?.chart.destroy();
    this.instance = undefined;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CloudChartsWlineComponent],
  template: `
    <h1>cloud-charts — Angular Wline 断轴 Demo</h1>
    <p>
      <code>&#64;alicloud/cloud-charts-wline</code> + Y 轴断轴（G2 5.4+ 新特性）。
      4 个系列数值跨度从 950 到 4,120,500，不开断轴时小系列被压成几乎贴近 0 的直线。
    </p>

    <div class="row">
      <div class="cell">
        <h3>无断轴（Sports/Strategy 几乎不可见）</h3>
        <cloud-charts-wline [data]="lineData" [config]="noBreaksConfig" height="360"></cloud-charts-wline>
      </div>
      <div class="cell">
        <h3>单段断轴 [6000, 100000]</h3>
        <cloud-charts-wline [data]="lineData" [config]="singleBreakConfig" height="360"></cloud-charts-wline>
      </div>
      <div class="cell">
        <h3>双段断轴 [6000, 100000] + [105000, 4100000]</h3>
        <cloud-charts-wline [data]="lineData" [config]="doubleBreakConfig" height="360"></cloud-charts-wline>
      </div>
    </div>
  `,
  styles: [`
    h1 { font-size: 18px; }
    p { color: #555; font-size: 13px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .cell { flex: 1; min-width: 380px; border: 1px solid rgba(128,128,128,0.3); border-radius: 4px; padding: 12px; }
    h3 { font-size: 13px; margin: 0 0 8px 0; color: #555; }
  `],
})
export class AppComponent {
  lineData = breakData;

  noBreaksConfig: LineChartConfig = {
    animate: false,
    xAxis: { type: 'time', mask: 'MM-DD', title: false },
    yAxis: { title: false },
  };

  singleBreakConfig: LineChartConfig = {
    animate: false,
    xAxis: { type: 'time', mask: 'MM-DD', title: false },
    yAxis: {
      title: false,
      breaks: [{ start: 6000, end: 100000, gap: 0.03 }],
    },
  };

  doubleBreakConfig: LineChartConfig = {
    animate: false,
    xAxis: { type: 'time', mask: 'MM-DD', title: false },
    yAxis: {
      title: false,
      breaks: [
        { start: 6000, end: 100000, gap: 0.03 },
        {
          start: 105000,
          end: 4100000,
          gap: 0.03,
          vertices: 60,
          verticeOffset: 4,
          compress: 'end',
        },
      ],
    },
  };
}
