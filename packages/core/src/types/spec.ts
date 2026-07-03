export type ChartPrimitiveValue = string | number | boolean | null;

export type ChartDataRecord = Record<string, ChartPrimitiveValue>;

export interface ChartSpec {
  type: string;
  data?: ChartDataRecord[] | Array<Record<string, unknown>> | Record<string, unknown>;
  encode?: Record<string, string | string[] | unknown>;
  scale?: Record<string, unknown>;
  axis?: Record<string, unknown> | false;
  legend?: Record<string, unknown> | false;
  tooltip?: Record<string, unknown> | false;
  transform?: Array<Record<string, unknown>>;
  style?: Record<string, unknown>;
  labels?: Array<Record<string, unknown>>;
  theme?: Record<string, unknown>;
  slider?: Record<string, unknown> | false;
  scrollbar?: Record<string, unknown> | false;
  interaction?: Record<string, unknown>;
  coordinate?: Record<string, unknown>;
  animate?: Record<string, unknown> | boolean;
  padding?: 'auto' | number | number[];
  inset?: number | { top?: number; right?: number; bottom?: number; left?: number };
  children?: ChartSpec[];
}

export interface ChartSpecContext {
  theme?: string;
  locale?: string;
  width?: number;
  height?: number;
}
