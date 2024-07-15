import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PrefixName } from '../../../constants';
import { ListItem } from '@antv/g2/esm/dependents';
import { Chart } from '@antv/g2';
import themes from '../../../themes';
import { filterLegend, highlightLegend, clearHighlight } from '../../../common/chartRefs';
import './index.scss';

const Prefix = `${PrefixName}-gradient-legend-`;

export interface GradientLegendProps {
  /** 配置项 */
  config: any;

  /** chart实例 **/
  chart: Chart;

  /** legend items */
  legendItems: ListItem[];
}

// 默认的颜色映射
const DefaultColors = [
  {
    type: 'green',
    color: themes['widgets-color-green'],
  },
  {
    type: 'yellow',
    color: themes['widgets-color-yellow'],
  },
  {
    type: 'orange',
    color: themes['widgets-color-orange'],
  },
  {
    type: 'red',
    color: themes['widgets-color-red'],
  },
];

export default function GradientLegend({ config, chart, legendItems = [] }: GradientLegendProps) {
  // @ts-ignore
  const { widgetsCtx } = chart;

  const containerWidth = widgetsCtx?.size[0];
  const containerHeight = widgetsCtx?.size[1] || 200;

  const legendField = widgetsCtx?.legendField || 'type';

  console.log('legend items', legendItems);

  const { valueRange = [0, 100], colors = DefaultColors } = config?.gradient || {};

  // 修改图表宽高
  useEffect(() => {
    const height = containerHeight - 50;
    const chartDom = widgetsCtx?.chartDom;
    // @ts-ignore
    chartDom.style.height = `${height}px`;
    chart.changeSize(containerWidth, height);
  }, [containerHeight, containerWidth]);

  // hover高亮legend
  const activeItem = (itemName: string) => {
    highlightLegend(chart, (value: any) => value === itemName, legendField);
  };

  // 清除高亮
  const clearActive = () => {
    clearHighlight(chart);
  };

  return (
    <div className={`${Prefix}container`}>
      <div>{valueRange?.[0]}</div>
      <div className={`${Prefix}items`}>
        {colors.map(({ type, color }: { type: string; color: string }) => {
          return (
            <div
              key={type}
              style={{ width: 50, height: 20, background: color }}
              onMouseEnter={() => {
                activeItem(type);
              }}
              onMouseLeave={() => {
                clearActive();
              }}
            />
          );
        })}
      </div>
      <div>{valueRange?.[1]}</div>
    </div>
  );
}
