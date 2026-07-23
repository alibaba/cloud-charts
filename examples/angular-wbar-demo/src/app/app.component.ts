import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import {
  renderWbarModel,
  type BarChartConfig,
  type BarSeries,
  type WbarModelInstance,
} from '@alicloud/cloud-charts-bar';
import type { G2ChartLike } from '@alicloud/cloud-charts-core';

const sampleData: BarSeries[] = [
  { name: '机房A', data: [['周一', 4092], ['周二', 1592], ['周三', 3714], ['周四', 4854], ['周五', 6514], ['周六', 9022], ['周日', 6023]] },
  { name: '机房B', data: [['周一', 6051], ['周二', 3278], ['周三', 5175], ['周四', 6548], ['周五', 9048], ['周六', 11394], ['周日', 8597]] },
  { name: '机房C', data: [['周一', 2051], ['周二', 3278], ['周三', 4175], ['周四', 2548], ['周五', 1048], ['周六', 1394], ['周日', 5597]] },
];

// 断轴用例数据：4 系列数值跨度极大（950 ~ 4,120,500）
// 不开断轴时小系列被压成贴近 0 的极矮柱子
const breakData: BarSeries[] = [
  { name: 'Sports',   data: [['周一', 1800], ['周二', 2500], ['周三', 3100], ['周四', 4200], ['周五', 3890], ['周六', 5200], ['周日', 5600]] },
  { name: 'Strategy', data: [['周一', 950],  ['周二', 1400], ['周三', 2200], ['周四', 1750], ['周五', 2800], ['周六', 3300], ['周日', 2900]] },
  { name: 'Shooter',  data: [['周一', 101200], ['周二', 104800], ['周三', 102600], ['周四', 103500], ['周五', 104200], ['周六', 102900], ['周日', 103800]] },
  { name: 'Other',    data: [['周一', 4120500], ['周二', 4107800], ['周三', 4112300], ['周四', 4109500], ['周五', 4115000], ['周六', 4111200], ['周日', 4108800]] },
];

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>cloud-charts — Angular Wbar Demo</h1>
    <p>使用 <code>&#64;alife/cloud-bar</code> 在 Angular 17 standalone component 中渲染柱状图（零 G2 import）。</p>

    <h2>基础用例</h2>
    <div class="row">
      <div class="cell">
        <h3>基础柱状图</h3>
        <div #basicContainer class="chart"></div>
      </div>
      <div class="cell">
        <h3>堆叠柱状图</h3>
        <div #stackContainer class="chart"></div>
      </div>
      <div class="cell">
        <h3>带网格线</h3>
        <div #gridContainer class="chart"></div>
      </div>
    </div>

    <h2 class="section">Y 轴断轴（G2 5.4+ 新特性）</h2>
    <p class="hint">
      4 系列数值跨度从 950 到 4,120,500，不开断轴时 Sports/Strategy 几乎不可见；
      开启 yAxis.breaks 后 4 个量级在不同区间清晰展开。
    </p>
    <div class="row">
      <div class="cell">
        <h3>无断轴（小系列贴底）</h3>
        <div #noBreaksContainer class="chart-tall"></div>
      </div>
      <div class="cell">
        <h3>单段断轴 [6000, 100000]</h3>
        <div #singleBreakContainer class="chart-tall"></div>
      </div>
      <div class="cell">
        <h3>双段断轴 [6000,100000] + [105000,4100000]</h3>
        <div #doubleBreakContainer class="chart-tall"></div>
      </div>
    </div>
  `,
  styles: [`
    h1 { font-size: 18px; }
    h2 { font-size: 15px; margin: 24px 0 8px 0; color: #333; }
    h2.section { border-top: 1px solid #eee; padding-top: 16px; margin-top: 32px; }
    h3 { font-size: 13px; margin: 0 0 8px 0; color: #555; }
    .hint { color: #888; font-size: 12px; }
    .row { display: flex; gap: 12px; flex-wrap: wrap; }
    .cell { flex: 1; min-width: 320px; border: 1px solid rgba(128,128,128,0.3); border-radius: 4px; padding: 12px; }
    .chart { width: 100%; height: 300px; }
    .chart-tall { width: 100%; height: 360px; }
  `],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('basicContainer', { static: true }) basicContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('stackContainer', { static: true }) stackContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('gridContainer', { static: true }) gridContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('noBreaksContainer', { static: true }) noBreaksContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('singleBreakContainer', { static: true }) singleBreakContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('doubleBreakContainer', { static: true }) doubleBreakContainer!: ElementRef<HTMLDivElement>;

  private instances: WbarModelInstance<G2ChartLike>[] = [];

  ngAfterViewInit() {
    const baseCases: Array<[ElementRef<HTMLDivElement>, BarSeries[], BarChartConfig]> = [
      [this.basicContainer, sampleData, {}],
      [this.stackContainer, sampleData, { stack: true }],
      [this.gridContainer, sampleData, { grid: true }],
      [this.noBreaksContainer, breakData, {
        animate: false,
        yAxis: { title: false },
      }],
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
            {
              start: 105000,
              end: 4100000,
              gap: 0.05,
              vertices: 60,
              verticeOffset: 4,
              compress: 'end',
            },
          ],
        },
      }],
    ];
    for (const [ref, data, config] of baseCases) {
      const inst = renderWbarModel({
        container: ref.nativeElement,
        data,
        config,
      });
      this.instances.push(inst);
    }
  }

  ngOnDestroy() {
    this.instances.forEach((inst) => inst.chart.destroy());
    this.instances = [];
  }
}
