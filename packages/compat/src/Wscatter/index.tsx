import React from 'react';
import { Scatter, type ScatterProps } from '@alicloud/cloud-charts-react';
import type { ScatterChartConfig } from '@alicloud/cloud-charts-core';

export interface WscatterLegacyProps {
  data: ScatterProps['data'];
  config?: ScatterChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: ScatterProps['event'];
  interaction?: ScatterProps['interaction'];
  getChartInstance?: ScatterProps['getChartInstance'];
  chartRef?: ScatterProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wscatter> 兼容层 */
export function Wscatter(props: WscatterLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Scatter {...rest} height={normalizedHeight} />;
}
