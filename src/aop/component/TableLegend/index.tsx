import React, { useState, useEffect, useMemo, useRef } from 'react';
import themes from '../../../themes';
import { PrefixName } from '../../../constants';
import { ListItem } from '@antv/g2/esm/dependents';
import { Chart } from '@antv/g2';
import { getStatistics, filterLegend, highlightLegend, clearHighlight } from '../../../common/chartRefs';
import { getItemData } from '../../../common/rectLegend';
import { customFormatter } from '../../../common/common';
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
  const { hoverable, clickable, itemName, useReverseChecked } = config;

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

  // 进位相关配置项
  const chartConfig = widgetsCtx?.props?.config ?? {};
  let formatConfig: any;
  // 当legend中配置了单位相关信息时，直接使用tooltip的配置项，否则使用y轴配置项
  if (
    typeof chartConfig?.legend === 'object' &&
    (chartConfig?.legend?.valueType ||
      chartConfig?.legend?.unit ||
      chartConfig?.legend?.needUnitTransform ||
      chartConfig?.legend?.unitTransformTo)
  ) {
    formatConfig = chartConfig.legend;
  } else if (Array.isArray(chartConfig.yAxis) && chartConfig.yAxis.length >= 2) {
    // 双轴
    formatConfig = chartConfig.yAxis;
  } else if (Array.isArray(chartConfig.yAxis)) {
    formatConfig = chartConfig?.yAxis?.[0] ?? {};
  } else {
    formatConfig = chartConfig?.yAxis ?? {};
  }

  if (dataType === 'treeNode') {
    let filterData = [...(chart?.options?.data ?? [])];
    const firstDepthCount = filterData.filter((sub: any) => sub.depth === 1)?.length;
    const secondDepthCount = filterData.filter((sub: any) => sub.depth === 2)?.length;

    // 增加特殊逻辑，如果目前包含2层以上，则只展示第一层数据
    if (firstDepthCount > 0 && secondDepthCount > 0) {
      filterData = filterData.filter((sub: any) => sub.depth === 1);
    }

    const filterDataIdList = filterData.map((sub: any) => sub.id);
    legendItems = legendItems.filter((item: ListItem) => filterDataIdList.includes(item.id));

    legendItems.map((item: ListItem) => {
      const idx = filterData.findIndex((sub: any) => sub.id === item.id);
      if (typeof item.marker === 'object') {
        item.marker.dataFill = filterData[idx].color ?? null;
      }

      item.data = filterData[idx]?.value ?? filterData[idx]?.rawValue ?? null;
    })

    legendItems.sort((a: any, b: any) => b.data - a.data);
  }

  return (
    <table
      className={`${prefix}-container`}
      style={{
        marginLeft: position === 'right' ? 10 : 0,
        ...config?.table?.style,
      }}
    >
      {columns > 0 && !config?.table?.hideTitle && (
        <thead className={`${prefix}-thead`}>
          <tr
            className={`${prefix}-tr ${prefix}-legend-title`}
            style={{
              gridTemplateColumns: `8px minmax(min(80px, 40%), 1fr) repeat(${columns}, 8px minmax(min(30px, ${60 - (1 / columns * 100)}),1fr))`,
            }}
          >
            <th />
            <th />
            {statistics?.map((statistic: string) => {
              return (
                <>
                  <th />
                  <th key={statistic}>{getText(statistic, widgetsCtx?.language, widgetsCtx?.context?.locale)}</th>
                </>
              );
            })}
            {(config?.table?.custom || []).map((customItem: any, index: number) => {
              return (
                <>
                  <th />
                  <th key={`custom${index}`}>{customItem?.title ?? ''}</th>
                </>
              );
            })}
          </tr>
        </thead>
      )}
      <tbody
        className={`${prefix}-tbody`}
        style={{
          height: `calc(100% - ${columns > 0 && !config?.table?.hideTitle ? 20 : 0}px)`,
        }}
      >
        {legendItems.map((legendItem: ListItem, index: number) => {
          let { name, marker } = legendItem;
          const id = legendItem.id ?? name;
          if (itemName) {
            name = itemName?.formatter?.(name, index, legendItem);
          }
          return (
            <tr
              key={id}
              className={`${prefix}-tr ${prefix}-legend-item ${clickable ? 'pointer' : ''}`}
              style={{
                gridTemplateColumns:
                  columns > 0 ? `8px minmax(min(80px, 40%), 1fr) repeat(${columns}, 8px minmax(min(30px, ${60 - (1 / columns * 100)}%),1fr))` : '8px minmax(min(80px, 30%), 100%)',
                color: !filteredItems.includes(id)
                  ? activedItem === id
                    ? themes['widgets-legend-text-highlight']
                    : themes['widgets-legend-text-normal']
                  : themes['widgets-color-disable'],
              }}
              onMouseEnter={() => {
                if (hoverable && !filteredItems.includes(id)) {
                  setActivedItem(id);
                }
              }}
              onMouseLeave={() => {
                if (hoverable && !filteredItems.includes(id)) {
                  setActivedItem('');
                }
              }}
              onClick={(event: any) => {
                // 是否按Control
                const hasControl = event.ctrlKey || event.metaKey;
                if (clickable) {
                  if ((!useReverseChecked && !hasControl) || (useReverseChecked && hasControl)) {
                    // 正选
                    if (filteredItems?.length === legendItems?.length - 1 && !filteredItems.includes(id)) {
                      setFilteredItems([]);
                    } else {
                      setFilteredItems(
                        legendItems
                          .map((item: ListItem) => item.id || item.name)
                          .filter((legendName: string) => legendName !== id),
                      );
                    }
                  } else {
                    // 反选
                    if (filteredItems?.length === legendItems?.length - 1 && !filteredItems.includes(id)) {
                      setFilteredItems([]);
                    } else if (filteredItems.includes(id)) {
                      setFilteredItems((pre: string[]) => pre.filter((p: string) => p !== id));
                    } else {
                      setFilteredItems((pre: string[]) => [...pre, id]);
                    }
                  }
                }
              }}
            >
              <td className={`${prefix}-marker`}>
                <LegendMarker marker={marker} disable={filteredItems.includes(id)} item={legendItem} />
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
                    // value = formatValue(value, config?.decimal);
                    let customValueFormatter = null;
                    if (Array.isArray(formatConfig)) {
                      // 双轴
                      // @ts-ignore
                      const dataGroup = getItemData(name, widgetsCtx?.rawData, config?.dataType, widgetsCtx?.data);
                      customValueFormatter =
                        (dataGroup as any)?.yAxis === 1
                          ? customFormatter(formatConfig[1])
                          : customFormatter(formatConfig[0]);
                    } else {
                      // 单轴
                      customValueFormatter = customFormatter(formatConfig);
                    }

                    if (customValueFormatter) {
                      value = customValueFormatter(value);
                    } else {
                      value = formatValue(value, config?.decimal);
                    }
                  }
                } else {
                  value = '-';
                }
                return (
                  <>
                    <td />
                    <td className={`${prefix}-statistics`} key={statistic}>
                      {value}
                    </td>
                  </>
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
                  <>
                    <td />
                    <td className={`${prefix}-statistics`} key={`custom${index}`}>
                      {value}
                    </td>
                  </>
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
