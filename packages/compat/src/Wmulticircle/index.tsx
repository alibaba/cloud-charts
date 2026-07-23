import React from 'react';
import { MultiCircle, type MultiCircleProps } from '@alicloud/cloud-charts-react';
import type { MultiCircleChartConfig } from '@alicloud/cloud-charts-core';

export interface WmulticircleLegacyProps {
  data: MultiCircleProps['data'];
  config?: MultiCircleChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: MultiCircleProps['event'];
  interaction?: MultiCircleProps['interaction'];
  getChartInstance?: MultiCircleProps['getChartInstance'];
  chartRef?: MultiCircleProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wmulticircle> 兼容层 */
export function Wmulticircle(props: WmulticircleLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <MultiCircle {...rest} height={normalizedHeight} />;
}
