import React from 'react';
import { Histogram, type HistogramProps } from '@alicloud/cloud-charts-react';
import type { HistogramChartConfig } from '@alicloud/cloud-charts-core';

export interface WhistogramLegacyProps {
  data: HistogramProps['data'];
  config?: HistogramChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: HistogramProps['event'];
  interaction?: HistogramProps['interaction'];
  getChartInstance?: HistogramProps['getChartInstance'];
  chartRef?: HistogramProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Whistogram> 兼容层 */
export function Whistogram(props: WhistogramLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Histogram {...rest} height={normalizedHeight} />;
}
