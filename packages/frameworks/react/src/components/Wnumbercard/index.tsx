import React from 'react';
import { beautifyNumber } from '@alicloud/cloud-charts-core';
import { Wcircle } from '../Wcircle/index';

export interface NumbercardChartLine {
  type: 'Wline';
  data: unknown[];
  position?: 'left' | 'right' | 'top' | 'bottom';
  width?: number;
  height?: number;
}

export interface NumbercardChartCircle {
  type: 'Wcircle';
  data: number;
  position?: 'left' | 'right' | 'top' | 'bottom';
  config?: Record<string, unknown>;
}

export interface NumbercardConfig {
  position?: 'left' | 'center';
  status?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium';
  backgroundType?: 'fill' | 'none' | 'image';
  backgroundImage?: string;
  iconPosition?: 'left' | 'right' | 'top-left';
  labelTags?: Array<{ text: string; status?: string }>;
  valueTags?: Array<{ text: string; status?: string; trend?: 'up' | 'down' }>;
  chart?: NumbercardChartLine | NumbercardChartCircle | React.ReactNode;
  extra?: React.ReactNode;
  itemStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
}

export interface WnumbercardProps {
  data: { label: string | React.ReactNode; value?: number | string | React.ReactNode; unit?: string };
  config?: NumbercardConfig;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export interface WnumberoverviewProps {
  data: WnumbercardProps[];
  config?: {
    columns?: number;
    margin?: number | [number, number];
    showDivider?: boolean;
    backgroundType?: 'fill' | 'none' | 'image';
    size?: 'small' | 'medium';
  };
  className?: string;
  style?: React.CSSProperties;
}

const PREFIX = 'cc-wnumbercard';

function renderValue(value: WnumbercardProps['data']['value'], unit?: string) {
  if (value == null) return null;
  const display = typeof value === 'number' ? beautifyNumber(value) : value;
  return (
    <span className={`${PREFIX}-value`}>
      {display}
      {unit && <span className={`${PREFIX}-unit`}>{unit}</span>}
    </span>
  );
}

function renderChart(chart: NumbercardConfig['chart']) {
  if (!chart) return null;
  if (React.isValidElement(chart)) return chart;
  const c = chart as NumbercardChartCircle;
  if (c.type === 'Wcircle') {
    return <Wcircle percent={c.data} radius={22} {...(c.config || {})} />;
  }
  return null;
}

export function Wnumbercard(props: WnumbercardProps) {
  const { data, config = {}, className, style, onClick } = props;
  const bgType = config.backgroundType || 'none';
  const status = config.status || 'default';

  return (
    <div
      className={`cloud-charts ${PREFIX} ${PREFIX}-${bgType} ${PREFIX}-${status} ${className || ''}`}
      style={{ ...config.itemStyle, ...style }}
      onClick={onClick}
    >
      {config.icon && <div className={`${PREFIX}-icon`}>{config.icon}</div>}
      <div className={`${PREFIX}-content`} style={{ textAlign: config.position === 'center' ? 'center' : 'left' }}>
        <div className={`${PREFIX}-label`} style={config.labelStyle}>
          {data.label}
          {config.labelTags?.map((tag, i) => (
            <span key={i} className={`${PREFIX}-label-tag ${PREFIX}-tag-${tag.status || 'default'}`}>{tag.text}</span>
          ))}
        </div>
        <div className={`${PREFIX}-value-row`} style={config.valueStyle}>
          {renderValue(data.value, data.unit)}
          {config.valueTags?.map((tag, i) => (
            <span key={i} className={`${PREFIX}-value-tag ${PREFIX}-tag-${tag.status || 'default'}`}>
              {tag.trend && <span className={`${PREFIX}-trend-${tag.trend}`} />}
              {tag.text}
            </span>
          ))}
        </div>
      </div>
      {config.chart && <div className={`${PREFIX}-chart`}>{renderChart(config.chart)}</div>}
      {config.extra && <div className={`${PREFIX}-extra`}>{config.extra}</div>}
    </div>
  );
}

export function Wnumberoverview(props: WnumberoverviewProps) {
  const { data, config = {}, className, style } = props;
  const columns = config.columns || Math.min(6, Math.max(2, data.length));
  const margin = typeof config.margin === 'number' ? config.margin : (config.margin?.[0] ?? 16);

  return (
    <div className={`cloud-charts ${PREFIX}-overview ${className || ''}`} style={style}>
      <div className={`${PREFIX}-overview-grid`} style={{ display: 'flex', flexWrap: 'wrap', gap: `${margin}px` }}>
        {data.map((item, i) => (
          <div key={i} style={{ flex: `0 0 calc(${100 / columns}% - ${margin}px)` }}>
            <Wnumbercard
              {...item}
              config={{ ...config, ...item.config }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
