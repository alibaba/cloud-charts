import React from 'react';
import { Map, type MapProps } from '@alicloud/cloud-charts-react';
import type { MapChartConfig } from '@alicloud/cloud-charts-core';

export interface WmapLegacyProps {
  data: MapProps['data'];
  config?: MapChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: MapProps['event'];
  interaction?: MapProps['interaction'];
  getChartInstance?: MapProps['getChartInstance'];
  chartRef?: MapProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wmap> 兼容层 */
export function Wmap(props: WmapLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Map {...rest} height={normalizedHeight} />;
}
