import type { ChartPrimitiveValue } from '../types/spec';

/** 地图数据：GeoJSON + 数据 series */
export interface MapGeoData {
  type?: 'FeatureCollection';
  features?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface MapSeries {
  name: string;
  data: Array<{ name: string; value: number; lng?: number; lat?: number; [key: string]: unknown }>;
  /** 显示类型：area (填色区域) / point (散点) / heatmap (热力) */
  type?: 'area' | 'point' | 'heatmap';
  visible?: boolean;
}

export interface MapSpecConfig {
  legend?: Record<string, unknown> | boolean;
  tooltip?: Record<string, unknown> | boolean;
  /** GeoJSON 数据（默认中国地图） */
  geoData?: MapGeoData;
  /** 投影方式，默认 'geoMercator' */
  projection?: string;
}

export interface NormalizedMapRecord {
  name: ChartPrimitiveValue;
  value: ChartPrimitiveValue;
  lng?: number;
  lat?: number;
  type: string;
  [key: string]: unknown;
}

export function normalizeMapData(seriesList: MapSeries[]): NormalizedMapRecord[] {
  return seriesList.reduce<NormalizedMapRecord[]>((records, series) => {
    series.data.forEach((item) => {
      records.push({
        name: item.name,
        value: item.value,
        lng: item.lng,
        lat: item.lat,
        type: series.name,
      });
    });
    return records;
  }, []);
}
