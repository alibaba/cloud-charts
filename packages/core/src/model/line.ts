import type { ChartDataRecord, ChartPrimitiveValue, ChartSpec } from '../types/spec';

export interface LineSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
  yAxis?: number;
  visible?: boolean;
}

export interface LineSpecConfig {
  area?: boolean;
  stack?: boolean;
  spline?: boolean;
  symbol?: boolean;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  xAxis?: Record<string, unknown> | false;
  yAxis?: Record<string, unknown> | Array<Record<string, unknown>> | false;
  style?: Record<string, unknown>;
}

export interface NormalizedLineRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
  yAxis: number;
}

export function normalizeLineData(seriesList: LineSeries[]): NormalizedLineRecord[] {
  return seriesList.reduce<NormalizedLineRecord[]>((records, series) => {
    const yAxisIndex = series.yAxis ?? 0;
    const yAxisField = `y${yAxisIndex}`;
    const nextRecords = series.data.map(([xValue, yValue]) => ({
      x: xValue,
      y: yValue,
      yAxis: yAxisIndex,
      [yAxisField]: yValue,
      type: series.name,
      visible: series.visible === false ? false : null,
    }));

    return records.concat(nextRecords);
  }, []);
}

export function createLineSpec(data: LineSeries[], config: LineSpecConfig = {}): ChartSpec {
  const transforms: Array<Record<string, unknown>> = [];

  if (config.stack) {
    transforms.push({ type: 'stackY' });
  }

  const spec: ChartSpec = {
    type: config.area ? 'area' : 'line',
    data: normalizeLineData(data),
    encode: {
      x: 'x',
      y: 'y',
      color: 'type',
    },
    axis: buildAxisConfig(config),
    legend: normalizeBooleanConfig(config.legend),
    tooltip: normalizeBooleanConfig(config.tooltip),
    transform: transforms.length > 0 ? transforms : undefined,
    style: {
      shape: config.spline ? 'smooth' : undefined,
      marker: config.symbol || undefined,
      ...config.style,
    },
  };

  return spec;
}

function buildAxisConfig(config: LineSpecConfig): Record<string, unknown> | undefined {
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
  if (config === false) {
    return false;
  }

  if (config === true) {
    return undefined;
  }

  return config;
}
