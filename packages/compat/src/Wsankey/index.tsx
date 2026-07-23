import React from 'react';
import { Sankey, type SankeyProps } from '@alicloud/cloud-charts-react';
import type { SankeyChartConfig } from '@alicloud/cloud-charts-core';

export interface WsankeyLegacyProps {
  data: SankeyProps['data'];
  config?: SankeyChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: SankeyProps['event'];
  interaction?: SankeyProps['interaction'];
  getChartInstance?: SankeyProps['getChartInstance'];
  chartRef?: SankeyProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wsankey> 兼容层 */
export function Wsankey(props: WsankeyLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Sankey {...rest} height={normalizedHeight} />;
}
