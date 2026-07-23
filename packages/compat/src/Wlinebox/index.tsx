import React from 'react';
import { Linebox, type LineboxProps } from '@alicloud/cloud-charts-react';
import type { LineboxChartConfig } from '@alicloud/cloud-charts-core';

export interface WlineboxLegacyProps {
  data: LineboxProps['data'];
  config?: LineboxChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: LineboxProps['event'];
  interaction?: LineboxProps['interaction'];
  getChartInstance?: LineboxProps['getChartInstance'];
  chartRef?: LineboxProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wlinebox> 兼容层 */
export function Wlinebox(props: WlineboxLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Linebox {...rest} height={normalizedHeight} />;
}
