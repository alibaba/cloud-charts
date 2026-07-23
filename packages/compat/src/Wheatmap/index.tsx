import React from 'react';
import { Heatmap, type HeatmapProps } from '@alicloud/cloud-charts-react';
import type { HeatmapChartConfig } from '@alicloud/cloud-charts-core';

export interface WheatmapLegacyProps {
  data: HeatmapProps['data'];
  config?: HeatmapChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: HeatmapProps['event'];
  interaction?: HeatmapProps['interaction'];
  getChartInstance?: HeatmapProps['getChartInstance'];
  chartRef?: HeatmapProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wheatmap> 兼容层 */
export function Wheatmap(props: WheatmapLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Heatmap {...rest} height={normalizedHeight} />;
}
