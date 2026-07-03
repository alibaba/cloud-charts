import type { ChartDataRecord, ChartPrimitiveValue, ChartSpec } from '../types/spec';

export interface BarSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
  visible?: boolean;
}

export interface BarSpecConfig {
  stack?: boolean;
  dodge?: boolean;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | false;
  style?: Record<string, unknown>;
}

export interface NormalizedBarRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
}

export function normalizeBarData(seriesList: BarSeries[]): NormalizedBarRecord[] {
  return seriesList.reduce<NormalizedBarRecord[]>((records, series) => {
    const next = series.data.map(([xValue, yValue]) => ({
      x: xValue,
      y: yValue,
      type: series.name,
      visible: series.visible === false ? false : null,
    }));
    return records.concat(next);
  }, []);
}

export function createBarSpec(data: BarSeries[], config: BarSpecConfig = {}): ChartSpec {
  const transforms: Array<Record<string, unknown>> = [];
  if (config.stack) {
    transforms.push({ type: 'stackY' });
  } else if (config.dodge !== false) {
    transforms.push({ type: 'dodgeX' });
  }

  const spec: ChartSpec = {
    type: 'interval',
    data: normalizeBarData(data),
    encode: {
      x: 'x',
      y: 'y',
      color: 'type',
    },
    axis: buildAxisConfig(config),
    legend: normalizeBooleanConfig(config.legend),
    tooltip: normalizeBooleanConfig(config.tooltip),
    transform: transforms.length > 0 ? transforms : undefined,
    style: config.style,
  };

  return spec;
}

function buildAxisConfig(config: BarSpecConfig): Record<string, unknown> | undefined {
  if (config.xAxis === false && config.yAxis === false) {
    return false as unknown as Record<string, unknown>;
  }
  return {
    x: config.xAxis === false ? false : config.xAxis,
    y: config.yAxis === false ? false : config.yAxis,
  };
}

function normalizeBooleanConfig(
  config: Record<string, unknown> | boolean | undefined,
): Record<string, unknown> | false | undefined {
  if (config === false) return false;
  if (config === true) return undefined;
  return config;
}
