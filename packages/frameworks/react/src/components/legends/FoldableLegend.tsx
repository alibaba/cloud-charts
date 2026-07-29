import React, { useState, useEffect, useRef } from 'react';
import type { LegendItem } from '@alicloud/cloud-charts-core';
import { useLegendInteractions } from './useLegendInteractions';

export interface FoldableLegendProps {
  /** Legend items extracted from the chart instance */
  items: LegendItem[];
  /** G2 v5 chart instance (for filter / highlight) */
  chart: unknown;
  /** Original spec to filter data from */
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

export function FoldableLegend(props: FoldableLegendProps): JSX.Element | null {
  const legendField = props.legendField || 'color';

  const [foldable, setFoldable] = useState(false);
  const [folded, setFolded] = useState(true);
  const [num, setNum] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const {
    isFiltered,
    isActive,
    onItemClick,
    onItemEnter,
    onItemLeave,
  } = useLegendInteractions({
    chart: props.chart,
    items: props.items,
    legendField,
    clickable: props.clickable,
    hoverable: props.hoverable,
    useReverseChecked: props.useReverseChecked,
    allowAllCanceled: props.allowAllCanceled,
    originalSpec: props.originalSpec,
  });

  // Calculate fold state based on content size
  useEffect(() => {
    if (!contentRef.current) return;
    const sh = contentRef.current.scrollHeight;
    setFoldable(sh !== LEGEND_ITEM_HEIGHT);

    const children = contentRef.current.children;
    let count = 0;
    for (let i = 0; i < children.length; i++) {
      if ((children[i] as HTMLDivElement).offsetTop >= LEGEND_ITEM_HEIGHT) {
        break;
      }
      count++;
    }
    setNum(count);
  }, [props.items, props.containerWidth]);

  const handleUnfold = () => setFolded(false);
  const handleFold = () => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    setFolded(true);
  };

  const renderMarker = (item: LegendItem, disabled: boolean) => {
    const color = item.color || '#5B8FF9';
    const opacity = disabled ? 0.3 : 1;
    const markerType = props.markerType || 'hyphen';
    const baseStyle: React.CSSProperties = {
      display: 'inline-block',
      marginRight: 8,
      flexShrink: 0,
      opacity,
    };

    if (markerType === 'circle') {
      return <span style={{ ...baseStyle, width: 6, height: 6, borderRadius: '50%', background: color }} />;
    }
    if (markerType === 'square') {
      return <span style={{ ...baseStyle, width: 8, height: 8, background: color }} />;
    }
    return <span style={{ ...baseStyle, width: 12, height: 2, background: color }} />;
  };

  const displayName = (item: LegendItem, index: number) => {
    if (props.nameFormatter) {
      return props.nameFormatter(item.name, index, item);
    }
    return item.name;
  };

  return (
    <div style={{ position: 'relative', width: '100%', marginTop: 4 }}>
      <div
        ref={contentRef}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'center',
          alignContent: 'flex-start',
          maxHeight: folded ? `${FOLDED_MAX_HEIGHT}px` : `${props.containerHeight * UNFOLD_RATIO}px`,
          overflowY: !folded ? 'auto' : 'hidden',
        }}
      >
        {props.items.map((item, index) => {
          const id = String(item.name);
          return (
            <div
              key={id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                cursor: 'pointer',
                height: `${LEGEND_ITEM_HEIGHT}px`,
                marginRight: '16px',
                color: !isFiltered(id) ? (isActive(id) ? '#333' : '#666') : '#ccc',
              }}
              onMouseEnter={() => onItemEnter(item)}
              onMouseLeave={() => onItemLeave()}
              onClick={(e) => onItemClick(item, e)}
            >
              {renderMarker(item, isFiltered(id))}
              <span
                style={{
                  fontSize: '12px',
                  lineHeight: '14px',
                  maxWidth: `${props.containerWidth - 32}px`,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={displayName(item, index)}
              >
                {displayName(item, index)}
              </span>
            </div>
          );
        })}
      </div>
      {foldable && folded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 1,
            backdropFilter: 'blur(2px)',
            cursor: 'pointer',
            height: 18,
            padding: '0 4px',
            fontSize: 11,
            color: '#666',
          }}
          onClick={handleUnfold}
        >
          +{props.items.length - num}
        </div>
      )}
      {!folded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 4,
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: 1,
            backdropFilter: 'blur(2px)',
            cursor: 'pointer',
            height: 18,
            padding: '0 4px',
            fontSize: 11,
            color: '#666',
          }}
          onClick={handleFold}
        >
          收起
        </div>
      )}
    </div>
  );
}
