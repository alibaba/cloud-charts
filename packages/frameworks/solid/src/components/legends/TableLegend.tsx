import { createSignal, createEffect, For, type JSX } from 'solid-js';
import {
  filterChartByValues,
  highlightChartByValue,
  clearChartHighlight,
  type LegendModel,
  type LegendItem,
} from '@alicloud/cloud-charts-core';

export interface TableLegendProps {
  legend: LegendModel;
  items?: LegendItem[];
  chart?: unknown;
  originalSpec?: Record<string, unknown>;
  legendField?: string;
  clickable?: boolean;
  hoverable?: boolean;
  useReverseChecked?: boolean;
  allowAllCanceled?: boolean;
  containerHeight?: number;
}

const tableStyle: JSX.CSSProperties = {
  'font-size': '12px',
  color: '#333',
  'border-collapse': 'collapse',
  'margin-top': '8px',
  width: '100%',
};
const cellStyle: JSX.CSSProperties = {
  padding: '4px 8px',
  'text-align': 'left',
  'border-bottom': '1px solid rgba(0,0,0,0.06)',
};
const headerStyle: JSX.CSSProperties = {
  ...cellStyle,
  'font-weight': 600,
  background: 'rgba(0,0,0,0.02)',
};
const markerStyle = (color: string): JSX.CSSProperties => ({
  display: 'inline-block',
  width: '8px',
  height: '8px',
  'border-radius': '50%',
  background: color,
  'margin-right': '6px',
  'vertical-align': 'middle',
});

/**
 * TableLegend：旧 src/aop/component/TableLegend 的 Solid 移植。
 * 支持统计列（min/max/avg/current）由 tableConfig.statistics 字符串数组指定。
 * 支持 filter（点击过滤）和 highlight（hover 高亮）交互。
 */
export function TableLegend(props: TableLegendProps): JSX.Element | null {
  if (props.legend.mode !== 'table') return null;

  const cfg = (props.legend.tableConfig ?? {}) as {
    statistics?: string[];
    columns?: Array<{ key: string; title: string; render?: (item: LegendItem) => JSX.Element }>;
  };
  const statistics = cfg.statistics ?? ['current'];
  const columns = cfg.columns ?? [];
  const list = (): LegendItem[] => (props.items ?? props.legend.items ?? []) as LegendItem[];
  const legendField = (): string => props.legendField || 'color';
  const clickable = (): boolean => props.clickable ?? props.legend.clickable ?? true;
  const hoverable = (): boolean => props.hoverable ?? props.legend.hoverable ?? true;

  // Filter/highlight signals
  const [filteredItems, setFilteredItems] = createSignal<string[]>([]);
  const [activedItem, setActivedItem] = createSignal('');

  // Reset filtered items when items change
  let prevItemsKey = '';
  createEffect(() => {
    const key = list()
      .map((i) => i.name)
      .join(',');
    if (key !== prevItemsKey) {
      prevItemsKey = key;
      setFilteredItems([]);
    }
  });

  // Apply filter to chart
  createEffect(() => {
    const chart = props.chart;
    if (!chart) return;
    const filtered = filteredItems();
    const allNames = list().map((i) => String(i.name));
    const selected = allNames.filter((name) => !filtered.includes(name));
    if (selected.length === allNames.length && filtered.length === 0) {
      filterChartByValues(chart, legendField(), allNames, props.originalSpec);
    } else {
      filterChartByValues(chart, legendField(), selected, props.originalSpec);
    }
  });

  // Apply highlight to chart
  createEffect(() => {
    const chart = props.chart;
    if (!chart) return;
    const active = activedItem();
    if (active) {
      highlightChartByValue(chart, legendField(), active);
    } else {
      clearChartHighlight(chart);
    }
  });

  const onItemClick = (item: LegendItem, event: MouseEvent) => {
    if (!clickable()) return;
    const id = String(item.name);
    const hasControl = event.ctrlKey || event.metaKey;
    const useReverse = props.useReverseChecked ?? props.legend.useReverseChecked ?? false;
    const allNames = list().map((i) => String(i.name));
    const filtered = filteredItems();
    const allowAll = props.allowAllCanceled ?? props.legend.allowAllCanceled ?? false;

    if ((!useReverse && !hasControl) || (useReverse && hasControl)) {
      // Reverse-check: click to select ONLY this item
      if (filtered.length === allNames.length - 1 && !filtered.includes(id)) {
        setFilteredItems([]);
      } else {
        setFilteredItems(allNames.filter((name) => name !== id));
      }
    } else {
      // Single-check: toggle this item
      if (filtered.length === allNames.length - 1 && !filtered.includes(id)) {
        setFilteredItems([]);
      } else if (allowAll) {
        setFilteredItems(
          filtered.includes(id) ? filtered.filter((f) => f !== id) : [...filtered, id],
        );
      } else {
        if (filtered.includes(id)) {
          if (filtered.length < allNames.length - 1) {
            setFilteredItems(filtered.filter((f) => f !== id));
          }
        } else {
          setFilteredItems([...filtered, id]);
        }
      }
    }
    setActivedItem('');
  };

  const onItemEnter = (item: LegendItem) => {
    if (!hoverable()) return;
    if (filteredItems().includes(String(item.name))) return;
    setActivedItem(String(item.name));
  };

  const onItemLeave = () => {
    if (!hoverable()) return;
    setActivedItem('');
  };

  const isFiltered = (name: string) => filteredItems().includes(name);
  const isActive = (name: string) => activedItem() === name;

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={headerStyle}>系列</th>
          <For each={statistics}>{(s) => <th style={headerStyle}>{s}</th>}</For>
          <For each={columns}>{(c) => <th style={headerStyle}>{c.title}</th>}</For>
        </tr>
      </thead>
      <tbody>
        <For each={list()}>
          {(item) => {
            const id = String(item.name);
            return (
              <tr
                onClick={(e) => onItemClick(item, e)}
                onMouseEnter={() => onItemEnter(item)}
                onMouseLeave={() => onItemLeave()}
                style={{
                  cursor: 'pointer',
                  color: !isFiltered(id) ? (isActive(id) ? '#333' : '#666') : '#ccc',
                }}
              >
                <td style={cellStyle}>
                  {item.color ? <span style={markerStyle(item.color)} /> : null}
                  {item.name}
                </td>
                <For each={statistics}>
                  {(s) => <td style={cellStyle}>{String((item[s] as unknown) ?? '')}</td>}
                </For>
                <For each={columns}>
                  {(c) => (
                    <td style={cellStyle}>
                      {c.render ? c.render(item) : String((item[c.key] as unknown) ?? '')}
                    </td>
                  )}
                </For>
              </tr>
            );
          }}
        </For>
      </tbody>
    </table>
  );
}
