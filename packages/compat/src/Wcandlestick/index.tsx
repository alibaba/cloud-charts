import React from 'react';
import { Candlestick, type CandlestickProps } from '@alicloud/cloud-charts-react';
import type { CandlestickChartConfig } from '@alicloud/cloud-charts-core';

export interface WcandlestickLegacyProps {
  data: CandlestickProps['data'];
  config?: CandlestickChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: CandlestickProps['event'];
  interaction?: CandlestickProps['interaction'];
  getChartInstance?: CandlestickProps['getChartInstance'];
  chartRef?: CandlestickProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wcandlestick> 兼容层 */
export function Wcandlestick(props: WcandlestickLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Candlestick {...rest} height={normalizedHeight} />;
}
