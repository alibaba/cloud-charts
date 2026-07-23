import React from 'react';
import { Sunburst, type SunburstProps } from '@alicloud/cloud-charts-react';
import type { SunburstChartConfig } from '@alicloud/cloud-charts-core';

export interface WsunburstLegacyProps {
  data: SunburstProps['data'];
  config?: SunburstChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: SunburstProps['event'];
  interaction?: SunburstProps['interaction'];
  getChartInstance?: SunburstProps['getChartInstance'];
  chartRef?: SunburstProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wsunburst> 兼容层 */
export function Wsunburst(props: WsunburstLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Sunburst {...rest} height={normalizedHeight} />;
}
