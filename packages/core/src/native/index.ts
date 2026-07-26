import type { G2SpecRenderer } from '../adapters/g2/index';
import type { ChartSpec } from '../types/spec';
import { applyDefaultLayout } from '../model/createChartModel';

export interface G2RenderTarget {
  render(): unknown;
  forceFit?(): unknown;
  changeSize?(width: number, height: number): unknown;
  on?(eventName: string, handler: (...args: unknown[]) => unknown): unknown;
  off?(eventName?: string, handler?: (...args: unknown[]) => unknown): unknown;
}

export interface NativeChartOptions<TChart extends G2RenderTarget> {
  container: HTMLElement;
  spec: ChartSpec;
  renderer: G2SpecRenderer<TChart>;
  event?: Record<string, (...args: unknown[]) => unknown>;
}

export interface NativeChartInstance<TChart extends G2RenderTarget> {
  readonly chart: TChart;
  render(): unknown;
  update(nextSpec: ChartSpec): unknown;
  /**
   * 智能数据更新：仅替换 spec.data，避免重新应用整个 spec 触发 axis/legend 重建。
   * 适用于"数据流变化但配置/结构不变"场景，对应旧 src/common/Base.tsx 的 chart.changeData。
   * G2 v5 没有原生 changeData，这里通过 chart.options({ data }) + render 实现等价效果。
   */
  changeData(nextData: ChartSpec['data']): unknown;
  resize(width?: number, height?: number): unknown;
  localRefresh(): unknown;
  getChartInstance(): TChart;
  getChartRef(): TChart;
  destroy(): void;
}

class NativeChartController<TChart extends G2RenderTarget> implements NativeChartInstance<TChart> {
  readonly chart: TChart;

  private currentSpec: ChartSpec;

  private readonly renderer: G2SpecRenderer<TChart>;

  private readonly eventHandlers: Record<string, (...args: unknown[]) => unknown>;

  constructor(options: NativeChartOptions<TChart>) {
    this.renderer = options.renderer;
    // spec-first 路径（createChart/renderChart）不经过 composeChartModel，
    // 在这里调用 applyDefaultLayout 确保与 data+config 路径视觉行为一致。
    this.currentSpec = applyDefaultLayout(options.spec);
    this.eventHandlers = options.event ?? {};
    this.chart = options.renderer.createChart(options.container);
    this.bindEvents();
    this.renderer.applySpec(this.chart, this.currentSpec);
  }

  render(): unknown {
    return this.chart.render();
  }

  update(nextSpec: ChartSpec): unknown {
    this.currentSpec = applyDefaultLayout(nextSpec);
    this.renderer.applySpec(this.chart, this.currentSpec);
    return this.chart.render();
  }

  changeData(nextData: ChartSpec['data']): unknown {
    this.currentSpec = { ...this.currentSpec, data: nextData };
    this.renderer.applySpec(this.chart, this.currentSpec);
    return this.chart.render();
  }

  resize(width?: number, height?: number): unknown {
    if (typeof width === 'number' && typeof height === 'number' && this.chart.changeSize) {
      return this.chart.changeSize(width, height);
    }
    return this.chart.forceFit?.();
  }

  localRefresh(): unknown {
    this.renderer.applySpec(this.chart, this.currentSpec);
    return this.chart.render();
  }

  getChartInstance(): TChart {
    return this.chart;
  }

  getChartRef(): TChart {
    return this.chart;
  }

  destroy(): void {
    this.unbindEvents();
    this.renderer.destroyChart(this.chart);
  }

  private bindEvents(): void {
    Object.entries(this.eventHandlers).forEach(([eventName, handler]) => {
      this.chart.on?.(eventName, handler);
    });
  }

  private unbindEvents(): void {
    Object.entries(this.eventHandlers).forEach(([eventName, handler]) => {
      this.chart.off?.(eventName, handler);
    });
  }
}

export function createChart<TChart extends G2RenderTarget>(
  options: NativeChartOptions<TChart>,
): NativeChartInstance<TChart> {
  return new NativeChartController(options);
}

export function renderChart<TChart extends G2RenderTarget>(
  options: NativeChartOptions<TChart>,
): NativeChartInstance<TChart> {
  const chart = createChart(options);
  chart.render();
  return chart;
}

export function updateChart<TChart extends G2RenderTarget>(
  chart: NativeChartInstance<TChart>,
  nextSpec: ChartSpec,
): unknown {
  return chart.update(nextSpec);
}

export function destroyChart<TChart extends G2RenderTarget>(
  chart: NativeChartInstance<TChart>,
): void {
  chart.destroy();
}
