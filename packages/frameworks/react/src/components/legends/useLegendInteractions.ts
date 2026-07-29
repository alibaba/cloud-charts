import { useState, useEffect, useRef } from 'react';
import {
  filterChartByValues,
  highlightChartByValue,
  clearChartHighlight,
  type LegendItem,
} from '@alicloud/cloud-charts-core';

export interface LegendInteractionProps {
  chart: unknown;
  items: LegendItem[];
  legendField: string;
  clickable?: boolean;
  hoverable?: boolean;
  useReverseChecked?: boolean;
  allowAllCanceled?: boolean;
  originalSpec?: Record<string, unknown>;
}

export function useLegendInteractions(props: LegendInteractionProps) {
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  const [activedItem, setActivedItem] = useState('');
  const prevItemsKey = useRef('');

  // Reset filtered items when items change
  useEffect(() => {
    const key = props.items.map((i) => i.name).join(',');
    if (key !== prevItemsKey.current) {
      prevItemsKey.current = key;
      setFilteredItems([]);
    }
  }, [props.items]);

  // Apply filter to chart
  useEffect(() => {
    const chart = props.chart;
    if (!chart) return;
    const filtered = filteredItems;
    const allNames = props.items.map((i) => String(i.name));
    const selected = allNames.filter((name) => !filtered.includes(name));
    if (selected.length === allNames.length && filtered.length === 0) {
      filterChartByValues(chart, props.legendField, allNames, props.originalSpec);
    } else {
      filterChartByValues(chart, props.legendField, selected, props.originalSpec);
    }
  }, [filteredItems, props.chart, props.items, props.legendField, props.originalSpec]);

  // Apply highlight to chart
  useEffect(() => {
    const chart = props.chart;
    if (!chart) return;
    if (activedItem) {
      highlightChartByValue(chart, props.legendField, activedItem);
    } else {
      clearChartHighlight(chart);
    }
  }, [activedItem, props.chart, props.legendField]);

  const onItemClick = (item: LegendItem, event: { ctrlKey?: boolean; metaKey?: boolean }) => {
    if (!props.clickable) return;
    const id = String(item.name);
    const hasControl = event.ctrlKey || event.metaKey;
    const useReverse = props.useReverseChecked;
    const allNames = props.items.map((i) => String(i.name));
    const filtered = filteredItems;

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
      } else if (props.allowAllCanceled) {
        setFilteredItems(
          filtered.includes(id)
            ? filtered.filter((f) => f !== id)
            : [...filtered, id],
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
    if (!props.hoverable) return;
    if (filteredItems.includes(String(item.name))) return;
    setActivedItem(String(item.name));
  };

  const onItemLeave = () => {
    if (!props.hoverable) return;
    setActivedItem('');
  };

  return {
    filteredItems,
    activedItem,
    onItemClick,
    onItemEnter,
    onItemLeave,
    isFiltered: (name: string) => filteredItems.includes(name),
    isActive: (name: string) => activedItem === name,
  };
}
