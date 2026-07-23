import React from 'react';
import { LineScatter, type LineScatterProps } from '@alicloud/cloud-charts-react';
import type { LineScatterChartConfig } from '@alicloud/cloud-charts-core';

export interface WlinescatterLegacyProps {
  data: LineScatterProps['data'];
  config?: LineScatterChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: LineScatterProps['event'];
  interaction?: LineScatterProps['interaction'];
  getChartInstance?: LineScatterProps['getChartInstance'];
  chartRef?: LineScatterProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wlinescatter> 兼容层 */
export function Wlinescatter(props: WlinescatterLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <LineScatter {...rest} height={normalizedHeight} />;
}
