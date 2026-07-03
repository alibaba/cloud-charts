export interface MapChartConfig {
  dataType?: 'g2' | string;
  colors?: unknown;
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** GeoJSON 数据（默认中国地图由旧版内置） */
  geoData?: Record<string, unknown>;
  /** 投影方式，默认 'geoMercator' */
  projection?: string;
  customConfig?: Record<string, unknown>;
  [key: string]: unknown;
}

export function getMapDefaultConfig(): MapChartConfig {
  return {
    legend: false,
    tooltip: true,
    projection: 'geoMercator',
  };
}
