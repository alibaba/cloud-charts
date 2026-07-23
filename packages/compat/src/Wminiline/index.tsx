import React from 'react';
import { Miniline, type MinilineProps } from '@alicloud/cloud-charts-react';
import type { MinilineChartConfig } from '@alicloud/cloud-charts-core';

export interface WminilineLegacyProps {
  data: MinilineProps['data'];
  config?: MinilineChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: MinilineProps['event'];
  interaction?: MinilineProps['interaction'];
  getChartInstance?: MinilineProps['getChartInstance'];
  chartRef?: MinilineProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wminiline> 兼容层 */
export function Wminiline(props: WminilineLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Miniline {...rest} height={normalizedHeight} />;
}
