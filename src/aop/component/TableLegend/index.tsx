import React, { useState, useEffect, useMemo, useRef } from 'react';
import themes from '../../../themes';
import { PrefixName } from '../../../constants';
import { ListItem } from '@antv/g2/esm/dependents';
import { Chart } from '@antv/g2';
import { getStatistics, filterLegend, highlightLegend, clearHighlight } from '../../../common/chartRefs';
import WidgetsTooltip from '../../../common/Tooltip';
import LegendMarker from '../../../common/LegendMarker';
import { getText } from '../../../ChartProvider';
import './index.scss';

const prefix = `${PrefixName}-table-legend`;

export interface TableLegendProps {
  /** 配置项 */
  config: any;

  /** chart实例 **/
  chart: Chart;

  /** legend items */
  legendItems: ListItem[];

  /** 容器 */
  container?: HTMLElement;
}

export default function TableLegend({ config, chart, legendItems = [], container }: TableLegendProps) {
  const [activedItem, setActivedItem] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const legendField = config?.legendField || 'type';

  const position = config.position.split('-')[0];
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const statistics = useMemo(() => {
    return config?.table?.statistics || ['current', 'min', 'max', 'avg'];
  }, [config?.table]);

  const statisticsRes = useMemo(() => getStatistics(chart, statistics, legendField), [chart, statistics, config]);

  // 计算legend宽高
  const height = useMemo(() => {
    return Math.min(containerHeight * (position === 'right' ? 1 : 0.3), 20 * legendItems.length + 20);
  }, [containerHeight, position, legendItems]);

  const width = useMemo(() => containerWidth * (position === 'right' ? 0.5 : 1), [containerWidth, position]);

  // 修改图表宽高
  useEffect(() => {
    const chartHeight = position === 'right' ? containerHeight : containerHeight - height;
    const chartWidth = position === 'right' ? containerWidth - width : containerWidth;
    const chartDom = container.children[0];
    // @ts-ignore
    chartDom.style.width = `${chartWidth}px`;
    // @ts-ignore
    chartDom.style.height = `${chartHeight}px`;
    chart.changeSize(chartWidth, chartHeight);
  }, [containerHeight, containerWidth, position, height, width]);

  useEffect(() => {
    setFilteredItems([]);
  }, [config]);

  useEffect(() => {
    filterLegend(
      chart,
      (value: any) => {
        return !filteredItems.includes(value);
      },
      legendField,
    );
  }, [filteredItems]);

  const activeItem = (itemName: string) => {
    highlightLegend(chart, (value: any) => value === itemName, legendField);
  };

  const clearActive = () => {
    clearHighlight(chart);
  };

  useEffect(() => {
    clearActive();
    if (activedItem) {
      activeItem(activedItem);
    }
  }, [activedItem]);

  return (
    <table
      className={`${prefix}-container`}
      style={{
        maxWidth: width,
        maxHeight: height,
        // marginTop: position === 'right' ? 0 : 10,
        marginLeft: position === 'right' ? 10 : 0,
      }}
    >
      <thead className={`${prefix}-thead`}>
        <tr
          className={`${prefix}-tr ${prefix}-legend-title`}
          style={{
            gridTemplateColumns: `8px minmax(80px, 100%) repeat(${statistics?.length || 0}, 100px)`,
          }}
        >
          <th />
          <th />
          {statistics?.map((statistic: string) => {
            return <th key={statistic}>{getText(statistic, config?.table?.language, config?.table?.locale)}</th>;
          })}
        </tr>
      </thead>
      <tbody className={`${prefix}-tbody`} style={{ maxHeight: height - 20 }}>
        {legendItems.map((legendItem: ListItem) => {
          const { name, marker } = legendItem;
          const id = legendItem.id ?? name;
          return (
            <tr
              key={id}
              className={`${prefix}-tr ${prefix}-legend-item`}
              style={{
                gridTemplateColumns: `8px minmax(80px, 100%) repeat(${statistics?.length || 0}, 100px)`,
                color: !filteredItems.includes(id)
                  ? activedItem === id
                    ? themes['widgets-legend-text-highlight']
                    : themes['widgets-legend-text-normal']
                  : themes['widgets-color-disable'],
              }}
              onMouseEnter={() => {
                if (!filteredItems.includes(id)) {
                  setActivedItem(id);
                }
              }}
              onMouseLeave={() => {
                if (!filteredItems.includes(id)) {
                  setActivedItem('');
                }
              }}
              onClick={() => {
                if (filteredItems?.length === legendItems?.length - 1 && !filteredItems.includes(id)) {
                  setFilteredItems([]);
                } else {
                  setFilteredItems(
                    legendItems
                      .map((item: ListItem) => item.id || item.name)
                      .filter((legendName: string) => legendName !== id),
                  );
                }
              }}
            >
              <td
                className={`${prefix}-marker`}
                onClick={(event) => {
                  if (filteredItems.includes(id)) {
                    setFilteredItems((pre) => pre.filter((filteredItem) => filteredItem !== id));
                  } else if (filteredItems.length !== legendItems.length - 1) {
                    setFilteredItems((pre) => [...pre, id]);
                    clearActive();
                  } else {
                    setFilteredItems([]);
                  }
                  event.stopPropagation();
                }}
              >
                <LegendMarker marker={marker} disable={filteredItems.includes(id)} />
              </td>
              <td>
                <LegendName name={name} />
              </td>
              {statistics?.map((statistic: string) => {
                const value = statisticsRes[id]?.[statistic];
                return (
                  <td className={`${prefix}-statistics`}>
                    {value || value === 0 ? formatValue(value, config?.table?.decimal) : '-'}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function LegendName({ name = '' }: { name: string }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div ref={ref} className={`${prefix}-name`}>
        {name}
      </div>
      <WidgetsTooltip
        ref={ref}
        content={name}
        offset={{ y: -ref.current?.parentElement?.parentElement?.parentElement?.scrollTop }}
      />
    </>
  );
}

/** 格式化数字 */
function formatValue(value: number | string, digits = 3) {
  return typeof value === 'number' ? value.toFixed(digits) : value.slice(0, digits + 2);
}
