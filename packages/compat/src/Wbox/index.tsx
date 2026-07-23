import React from 'react';
import { Box, type BoxProps } from '@alicloud/cloud-charts-react';
import type { BoxChartConfig } from '@alicloud/cloud-charts-core';

export interface WboxLegacyProps {
  data: BoxProps['data'];
  config?: BoxChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: BoxProps['event'];
  interaction?: BoxProps['interaction'];
  getChartInstance?: BoxProps['getChartInstance'];
  chartRef?: BoxProps['chartRef'];
}

/**
 * @alicloud/cloud-charts@3.x 旧 <Wbox> 兼容层：保持旧组件名与 props 不变，内部转发到新 React Box。
 */
export function Wbox(props: WboxLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Box {...rest} height={normalizedHeight} />;
}
