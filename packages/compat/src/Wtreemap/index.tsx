import React from 'react';
import { Treemap, type TreemapProps } from '@alicloud/cloud-charts-react';
import type { TreemapChartConfig } from '@alicloud/cloud-charts-core';

export interface WtreemapLegacyProps {
  data: TreemapProps['data'];
  config?: TreemapChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: TreemapProps['event'];
  interaction?: TreemapProps['interaction'];
  getChartInstance?: TreemapProps['getChartInstance'];
  chartRef?: TreemapProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Wtreemap> 兼容层 */
export function Wtreemap(props: WtreemapLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Treemap {...rest} height={normalizedHeight} />;
}
