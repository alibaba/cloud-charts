import React from 'react';
import { Hexagonal, type HexagonalProps } from '@alicloud/cloud-charts-react';
import type { HexagonalChartConfig } from '@alicloud/cloud-charts-core';

export interface WhexagonalLegacyProps {
  data: HexagonalProps['data'];
  config?: HexagonalChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: HexagonalProps['event'];
  interaction?: HexagonalProps['interaction'];
  getChartInstance?: HexagonalProps['getChartInstance'];
  chartRef?: HexagonalProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Whexagonal> 兼容层 */
export function Whexagonal(props: WhexagonalLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Hexagonal {...rest} height={normalizedHeight} />;
}
