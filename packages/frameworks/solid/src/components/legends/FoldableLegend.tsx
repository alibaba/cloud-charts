import { createSignal, createEffect, For, Show, type JSX } from 'solid-js';
import {
  filterChartByValues,
  highlightChartByValue,
  clearChartHighlight,
  type LegendItem,
} from '@alicloud/cloud-charts-core';

export interface FoldableLegendProps {
  /** Legend items extracted from the chart instance */
  items: LegendItem[];
  /** G2 v5 chart instance (for filter / highlight) */
  chart: unknown;
  /** Original spec to filter data from (avoids issues with serialized options) */
  originalSpec?: Record<string, unknown>;
  /** Wrapper width (for name max-width calculation) */
  containerWidth: number;
  /** Wrapper height (for unfold max-height calculation) */
  containerHeight: number;
  /** Color channel field name (default 'color') */
  legendField?: string;
  /** Whether clicking is enabled */
  clickable?: boolean;
  /** Whether hovering is enabled */
  hoverable?: boolean;
  /** Use reverse-checked mode (Ctrl+click = normal select, click = reverse select) */
  useReverseChecked?: boolean;
  /** Whether all items can be canceled */
  allowAllCanceled?: boolean;
  /** Name formatter */
  nameFormatter?: (name: string, index: number, item: LegendItem) => string;
  /** Marker type: 'hyphen' | 'square' | 'circle' */
  markerType?: 'hyphen' | 'square' | 'circle';
}

const LEGEND_ITEM_HEIGHT = 20;
const FOLDED_MAX_HEIGHT = 20;
const UNFOLD_RATIO = 0.3;

export function FoldableLegend(props: FoldableLegendProps): JSX.Element {
  const legendField = () => props.legendField || 'color';

  // Whether the legend content overflows (needs fold/unfold)
  const [foldable, setFoldable] = createSignal(false);
  // Whether currently folded
  const [folded, setFolded] = createSignal(true);
  // Number of visible items when folded
  const [num, setNum] = createSignal(0);
  // Currently highlighted item name
  const [activedItem, setActivedItem] = createSignal('');
  // Filtered (deselected) item names
  const [filteredItems, setFilteredItems] = createSignal<string[]>([]);

  let contentRef: HTMLDivElement | undefined;

  // Reset filtered items when items change
  let prevItemsKey = '';
  createEffect(() => {
    const key = props.items.map((i) => i.name).join(',');
    if (key !== prevItemsKey) {
      prevItemsKey = key;
      setFilteredItems([]);
    }
  });

  // Apply filter to chart when filteredItems change
  createEffect(() => {
    const chart = props.chart;
    if (!chart) return;
    const filtered = filteredItems();
    const allNames = props.items.map((i) => String(i.name));
    const selected = allNames.filter((name) => !filtered.includes(name));
    if (selected.length === allNames.length && filtered.length === 0) {
      // All visible - clear filters
      filterChartByValues(chart, legendField(), allNames, props.originalSpec);
    } else {
      filterChartByValues(chart, legendField(), selected, props.originalSpec);
    }
  });

  // Apply highlight to chart when activedItem changes
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

  // Calculate fold state based on content size
  createEffect(() => {
    if (!contentRef) return;
    const sh = contentRef.scrollHeight;
    setFoldable(sh !== LEGEND_ITEM_HEIGHT);

    // Count visible items when folded
    const children = contentRef.children;
    let count = 0;
    for (let i = 0; i < children.length; i++) {
      if ((children[i] as HTMLDivElement).offsetTop >= LEGEND_ITEM_HEIGHT) {
        break;
      }
      count++;
    }
    setNum(count);
  });

  const handleUnfold = () => {
    setFolded(false);
  };

  const handleFold = () => {
    if (contentRef) contentRef.scrollTop = 0;
    setFolded(true);
  };

  // Click handler - port of old FoldableLegend click logic
  const onItemClick = (item: LegendItem, event: MouseEvent) => {
    if (!props.clickable) return;
    const id = String(item.name);
    const hasControl = event.ctrlKey || event.metaKey;
    const useReverse = props.useReverseChecked;
    const allNames = props.items.map((i) => String(i.name));
    const filtered = filteredItems();

    if ((!useReverse && !hasControl) || (useReverse && hasControl)) {
      // Reverse-check: click to select ONLY this item (deselect all others)
      if (filtered.length === allNames.length - 1 && !filtered.includes(id)) {
        // All others already filtered → reset
        setFilteredItems([]);
      } else {
        // Select only this item
        setFilteredItems(allNames.filter((name) => name !== id));
      }
    } else {
      // Single-check: toggle this item in filtered list
      if (filtered.length === allNames.length - 1 && !filtered.includes(id)) {
        // All others already filtered, this is the last visible → reset
        setFilteredItems([]);
      } else if (props.allowAllCanceled) {
        // Toggle this item
        if (filtered.includes(id)) {
          setFilteredItems(filtered.filter((f) => f !== id));
        } else {
          setFilteredItems([...filtered, id]);
        }
      } else {
        // Toggle but keep at least one visible
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
    if (filteredItems().includes(String(item.name))) return;
    setActivedItem(String(item.name));
  };

  const onItemLeave = () => {
    if (!props.hoverable) return;
    setActivedItem('');
  };

  // Marker renderer
  const renderMarker = (item: LegendItem, disabled: boolean) => {
    const color = item.color || '#5B8FF9';
    const opacity = disabled ? 0.3 : 1;
    const markerType = props.markerType || 'hyphen';

    if (markerType === 'circle') {
      return (
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            'border-radius': '50%',
            background: color,
            opacity: String(opacity),
            'margin-right': '8px',
            'flex-shrink': '0',
          }}
        />
      );
    }
    if (markerType === 'square') {
      return (
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            background: color,
            opacity: String(opacity),
            'margin-right': '8px',
            'flex-shrink': '0',
          }}
        />
      );
    }
    // hyphen (line)
    return (
      <span
        style={{
          display: 'inline-block',
          width: '12px',
          height: '2px',
          background: color,
          opacity: String(opacity),
          'margin-right': '8px',
          'flex-shrink': '0',
        }}
      />
    );
  };

  const displayName = (item: LegendItem, index: number) => {
    if (props.nameFormatter) {
      return props.nameFormatter(item.name, index, item);
    }
    return item.name;
  };

  const isFiltered = (name: string) => filteredItems().includes(name);
  const isActive = (name: string) => activedItem() === name;

  return (
    <div style={{ position: 'relative', width: '100%', 'margin-top': '4px' }}>
      <div
        ref={contentRef}
        style={{
          width: '100%',
          display: 'flex',
          'flex-direction': 'row',
          'flex-wrap': 'wrap',
          'justify-content': 'flex-start',
          'align-items': 'center',
          'align-content': 'flex-start',
          'max-height': folded() ? `${FOLDED_MAX_HEIGHT}px` : `${props.containerHeight * UNFOLD_RATIO}px`,
          'overflow-y': !folded() ? 'auto' : 'hidden',
        }}
      >
        <For each={props.items}>
          {(item, index) => {
            const id = String(item.name);
            return (
              <div
                style={{
                  display: 'flex',
                  'flex-direction': 'row',
                  'align-items': 'center',
                  cursor: 'pointer',
                  height: `${LEGEND_ITEM_HEIGHT}px`,
                  'margin-right': '16px',
                  color: !isFiltered(id)
                    ? isActive(id)
                      ? '#333'
                      : '#666'
                    : '#ccc',
                }}
                onMouseEnter={() => onItemEnter(item)}
                onMouseLeave={() => onItemLeave()}
                onClick={(e) => onItemClick(item, e)}
              >
                {renderMarker(item, isFiltered(id))}
                <span
                  style={{
                    'font-size': '12px',
                    'line-height': '14px',
                    'max-width': `${props.containerWidth - 32}px`,
                    overflow: 'hidden',
                    'text-overflow': 'ellipsis',
                    'white-space': 'nowrap',
                  }}
                  title={displayName(item, index())}
                >
                  {displayName(item, index())}
                </span>
              </div>
            );
          }}
        </For>
      </div>
      <Show when={foldable() && folded()}>
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            display: 'flex',
            'align-items': 'center',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.12)',
            'border-radius': '1px',
            'backdrop-filter': 'blur(2px)',
            cursor: 'pointer',
            height: '18px',
            padding: '0 4px',
            'font-size': '11px',
            color: '#666',
          }}
          onClick={handleUnfold}
        >
          +{props.items.length - num()}
        </div>
      </Show>
      <Show when={!folded()}>
        <div
          style={{
            position: 'absolute',
            top: '0',
            right: '4px',
            display: 'flex',
            'align-items': 'center',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.12)',
            'border-radius': '1px',
            'backdrop-filter': 'blur(2px)',
            cursor: 'pointer',
            height: '18px',
            padding: '0 4px',
            'font-size': '11px',
            color: '#666',
          }}
          onClick={handleFold}
        >
          收起
        </div>
      </Show>
    </div>
  );
}

