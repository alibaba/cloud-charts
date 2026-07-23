import React from 'react';
import { Nightingale, type NightingaleProps } from '@alicloud/cloud-charts-react';
import type { NightingaleChartConfig } from '@alicloud/cloud-charts-core';

export interface WnightingaleLegacyProps {
  data: NightingaleProps['data'];
  config?: NightingaleChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: NightingaleProps['event'];
  interaction?: NightingaleProps['interaction'];
  getChartInstance?: NightingaleProps['getChartInstance'];
  chartRef?: NightingaleProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wnightingale> 兼容层 */
export function Wnightingale(props: WnightingaleLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Nightingale {...rest} height={normalizedHeight} />;
}
