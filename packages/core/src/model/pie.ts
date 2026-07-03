import type { ChartDataRecord, ChartPrimitiveValue, ChartSpec } from '../types/spec';

export interface PieSeries {
  name: string;
  data: Array<[ChartPrimitiveValue, ChartPrimitiveValue]>;
}

export interface PieSpecConfig {
  cycle?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  autoSort?: boolean;
  filterNegativeNumbers?: boolean;
}

export interface NormalizedPieRecord extends ChartDataRecord {
  x: ChartPrimitiveValue;
  y: ChartPrimitiveValue;
  type: string;
}

/**
 * Wpie 旧版数据为 [{ name, data: [[x, y]] }] 单系列；Wpie 在新 runtime 内同样按 type=name 注入，
 * x 作为分类，y 作为数值，便于 legend/tooltip 复用通用模型。
 */
export function normalizePieData(seriesList: PieSeries[]): NormalizedPieRecord[] {
  return seriesList.reduce<NormalizedPieRecord[]>((records, series) => {
    const next = series.data.map(([xValue, yValue]) => ({
      x: xValue,
      y: yValue,
      type: String(xValue),
    }));
    return records.concat(next);
  }, []);
}

export function createPieSpec(data: PieSeries[], config: PieSpecConfig = {}): ChartSpec {
  const records = normalizePieData(data);
  const innerRadius = config.cycle ? config.innerRadius ?? 0.6 : 0;

  const spec: ChartSpec = {
    type: 'interval',
    data: records,
    encode: {
      y: 'y',
      color: 'x',
    },
    transform: [{ type: 'stackY' }],
    coordinate: {
      type: 'theta',
      ...(typeof innerRadius === 'number' ? { innerRadius } : {}),
      ...(typeof config.outerRadius === 'number' ? { outerRadius: config.outerRadius } : {}),
      ...(typeof config.startAngle === 'number' ? { startAngle: config.startAngle } : {}),
      ...(typeof config.endAngle === 'number' ? { endAngle: config.endAngle } : {}),
    },
    legend: normalizeBooleanConfig(config.legend),
    tooltip: normalizeBooleanConfig(config.tooltip),
  };

  return spec;
}

function normalizeBooleanConfig(
  config: Record<string, unknown> | boolean | undefined,
): Record<string, unknown> | false | undefined {
  if (config === false) return false;
  if (config === true) return undefined;
  return config;
}
