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
}

export default function TableLegend({ config, chart, legendItems = [] }: TableLegendProps) {
  // @ts-ignore
  const { widgetsCtx } = chart;
  const [activedItem, setActivedItem] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  const legendField = widgetsCtx?.legendField || 'type';

  const position = config.position.split('-')[0];

  const statistics = useMemo(() => {
    return config?.table?.statistics || [];
  }, [config?.table]);

  // 目前暂时对多重圆环进行特殊处理，待规则统一梳理后，整理数据类型
  const dataType = widgetsCtx.chartName === 'G2MultiPie' ? 'treeNode' : 'common';
  const statisticsRes = useMemo(
    () => getStatistics(chart, statistics, legendField, dataType),
    [chart, statistics, config, legendItems],
  );

  // 表格列数
  const columns = (statistics?.length || 0) + (config?.table?.custom?.length || 0);

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
        marginLeft: position === 'right' ? 10 : 0,
      }}
    >
      {columns > 0 && (
        <thead className={`${prefix}-thead`}>
          <tr
            className={`${prefix}-tr ${prefix}-legend-title`}
            style={{
              gridTemplateColumns: `8px minmax(80px, 100%) repeat(${columns}, 100px)`,
            }}
          >
            <th />
            <th />
            {statistics?.map((statistic: string) => {
              return <th key={statistic}>{getText(statistic, widgetsCtx?.language, widgetsCtx?.context?.locale)}</th>;
            })}
            {(config?.table?.custom || []).map((customItem: any, index: number) => {
              return <th key={`custom${index}`}>{customItem?.title ?? ''}</th>;
            })}
          </tr>
        </thead>
      )}
      <tbody
        className={`${prefix}-tbody`}
        style={{
          height: `calc(100% - ${columns > 0 ? 20 : 0}px)`,
        }}
      >
        {legendItems.map((legendItem: ListItem) => {
          const { name, marker } = legendItem;
          const id = legendItem.id ?? name;
          return (
            <tr
              key={id}
              className={`${prefix}-tr ${prefix}-legend-item`}
              style={{
                gridTemplateColumns:
                  columns > 0 ? `8px minmax(80px, 100%) repeat(${columns}, 100px)` : '8px minmax(80px, 100%)',
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
                let value = statisticsRes[id]?.[statistic];
                if (value || value === 0) {
                  if (config?.valueFormatter && typeof config?.valueFormatter === 'function') {
                    value = config?.valueFormatter(value);
                  } else {
                    value = formatValue(value, config?.table?.decimal);
                  }
                } else {
                  value = '-';
                }
                return (
                  <td className={`${prefix}-statistics`} key={statistic}>
                    {value}
                  </td>
                );
              })}
              {(config?.table?.custom || []).map((customItem: any, index: number) => {
                const value =
                  typeof customItem?.value === 'function'
                    ? customItem.value({
                        ...legendItem,
                        ...statisticsRes[id],
                      })
                    : customItem?.value ?? '';
                return (
                  <td className={`${prefix}-statistics`} key={`custom${index}`}>
                    {value}
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
      <WidgetsTooltip ref={ref} content={name} />
    </>
  );
}

/** 格式化数字 */
function formatValue(value: number | string, digits = 3) {
  return typeof value === 'number' ? value.toFixed(digits) : value.slice(0, digits + 2);
}
