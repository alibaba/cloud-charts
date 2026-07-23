import React from 'react';
import { Radar, type RadarProps } from '@alicloud/cloud-charts-react';
import type { RadarChartConfig } from '@alicloud/cloud-charts-core';

export interface WradarLegacyProps {
  data: RadarProps['data'];
  config?: RadarChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: RadarProps['event'];
  interaction?: RadarProps['interaction'];
  getChartInstance?: RadarProps['getChartInstance'];
  chartRef?: RadarProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wradar> 兼容层 */
export function Wradar(props: WradarLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Radar {...rest} height={normalizedHeight} />;
}
