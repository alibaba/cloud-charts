import React from 'react';
import { Rectangle, type RectangleProps } from '@alicloud/cloud-charts-react';
import type { RectangleChartConfig } from '@alicloud/cloud-charts-core';

export interface WrectangleLegacyProps {
  data: RectangleProps['data'];
  config?: RectangleChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: RectangleProps['event'];
  interaction?: RectangleProps['interaction'];
  getChartInstance?: RectangleProps['getChartInstance'];
  chartRef?: RectangleProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wrectangle> 兼容层 */
export function Wrectangle(props: WrectangleLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Rectangle {...rest} height={normalizedHeight} />;
}
