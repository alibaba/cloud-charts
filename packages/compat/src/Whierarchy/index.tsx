import React from 'react';
import { Hierarchy, type HierarchyProps } from '@alicloud/cloud-charts-react';
import type { HierarchyChartConfig } from '@alicloud/cloud-charts-core';

export interface WhierarchyLegacyProps {
  data: HierarchyProps['data'];
  config?: HierarchyChartConfig;
  height?: number | string;
  width?: number | string;
  className?: string;
  style?: React.CSSProperties;
  language?: string;
  theme?: string;
  event?: HierarchyProps['event'];
  interaction?: HierarchyProps['interaction'];
  getChartInstance?: HierarchyProps['getChartInstance'];
  chartRef?: HierarchyProps['chartRef'];
}

/** @alicloud/cloud-charts@3.x 旧 <Whierarchy> 兼容层 */
export function Whierarchy(props: WhierarchyLegacyProps): JSX.Element {
  const { height, ...rest } = props;
  const normalizedHeight =
    typeof height === 'string' && height !== '' && !Number.isNaN(Number(height))
      ? Number(height)
      : height;
  return <Hierarchy {...rest} height={normalizedHeight} />;
}
