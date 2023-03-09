// @ts-ignore
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import Wline, { WlineConfig } from '../Wline';
import Wcircle from '../Wcircle';
import { beautifyNumber } from '../common/common';
import { PrefixName } from '../constants';
import './index.scss';

const prefix = `${PrefixName}-wnumbercard`;

export interface LineProps {
  type: 'line';
  data: any[];
  width?: number | string;
  height?: number | string;
  position?: 'left' | 'right' | 'top' | 'bottom';
  config?: WlineConfig;
}

export interface CircleProps {
  type: 'circle';
  data: number;
  position?: 'left' | 'right' | 'top' | 'bottom';
  config?: {
    title?: string;
    unit?: string;
    status?: 'normal' | 'warning' | 'error';
    color?: string;
    trend?: 'raise' | 'drop';
    radius?: number;
    bottomTitle?: string;
    bottomUnit?: string;
    bottomNumber?: number;
    bottomTrend?: 'raise' | 'drop';
    lineCap?: 'round' | 'butt';
    strokeWidth?: number;
  };
}

export interface IDataItem {
  label: string | React.ReactNode;
  // hideTooltip?: boolean;
  // labelTooltip?: string | React.ReactNode;
  // tooltipIcon?: React.ReactNode;
  value?: number | React.ReactNode;
  unit?: string;
  status?: 'working' | 'success' | 'warning' | 'error';
  itemStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
  statusStyle?: React.CSSProperties;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  trend?: number;
  chart?: LineProps | CircleProps | React.ReactNode;
  onClick?: React.MouseEventHandler;
}

export const Wnumbercard: React.FC<IDataItem> = (props) => {
  const iconPosition = props?.iconPosition || 'left';
  const chartPosition = props?.chart?.position || 'right';

  const iconElement = props?.icon && React.isValidElement(props.icon) ? props.icon : false;

  const trendChart = props?.trend !== undefined && typeof props?.trend === 'number' && (
    <div className={`${prefix}-item-trend ${props?.trend < 0 ? prefix + '-trend-down' : prefix + '-trend-up'}`}>
      {props?.trend < 0 ? (
        <svg width={10} height={12}>
          <polygon points="0,2 10,2 5,10" className={`${prefix}-trend-down`} />
        </svg>
      ) : (
        <svg width={10} height={12}>
          <polygon points="0,10 10,10 5,2" className={`${prefix}-trend-up`} />
        </svg>
      )}
      <span className={`${prefix}-trend-value ${prefix}-number`}>{Math.abs(props?.trend || 0)}%</span>
    </div>
  );

  const lineChart = props?.chart?.type === 'line' && (
    <div
      className={`${prefix}-item-line`}
      style={{
        alignSelf: chartPosition === 'top' || chartPosition === 'bottom' ? 'flex-start' : 'center',
      }}
    >
      <Wline
        data={props?.chart?.data || []}
        // width={props?.chart?.width || null}
        height={props?.chart?.height || 40}
        config={{
          xAxis: {
            visible: false,
          },
          yAxis: {
            visible: false,
          },
          legend: false,
          tooltip: false,
          ...props?.chart?.config,
        }}
        force
      />
    </div>
  );

  const circleChart = props?.chart?.type === 'circle' && (
    <div
      className={`${prefix}-item-circle`}
      style={{
        alignSelf: chartPosition === 'top' || chartPosition === 'bottom' ? 'flex-start' : 'center',
      }}
    >
      <Wcircle percent={props?.chart?.data || 0} {...{ radius: 22, ...props?.chart?.config }} />
    </div>
  );

  const chartElement = (React.isValidElement(props?.chart) && props.chart) || lineChart || circleChart;

  return (
    <div
      className={`${prefix}-data-item-container`}
      style={{
        ...(props?.itemStyle || {}),
        flexDirection: chartPosition === 'left' || chartPosition === 'right' ? 'row' : 'column',
      }}
      onClick={(event: any) => {
        props?.onClick?.(event);
      }}
    >
      {(chartPosition === 'left' || chartPosition === 'top') && chartElement}
      <div
        className={`${prefix}-item-content`}
        style={{
          flexDirection: iconPosition === 'left' || iconPosition === 'right' ? 'row' : 'column',
          justifyContent: chartElement && chartPosition === 'left' ? 'flex-end' : 'space-between',
          alignItems: chartElement && chartPosition === 'bottom' ? 'flex-start' : 'center',
        }}
      >
        {(iconPosition === 'left' || iconPosition === 'top') && iconElement}
        <div
          className={`${prefix}-main-content`}
          style={{ marginLeft: iconElement && iconPosition === 'left' ? 16 : 0 }}
        >
          <div className={`${prefix}-label-value-container`}>
            {props.status && (
              <div
                className={`${prefix}-item-status ${prefix + '-' + props.status || prefix + '-success'}`}
                style={props.statusStyle || {}}
              />
            )}
            <div className={`${prefix}-item-value`} style={props.valueStyle || {}}>
              {typeof props.value === 'number' ? (
                <span className={`${prefix}-value-number ${prefix}-number`}>
                  {beautifyNumber(props.value || 0, ',')}
                </span>
              ) : (
                props.value
              )}

              {props.unit && <div className={`${prefix}-item-unit`}>{props.unit}</div>}
              {trendChart}
            </div>
          </div>
          <div className={`${prefix}-item-label-container`} style={{ marginTop: props.value ? 8 : 0 }}>
            <div className={`${prefix}-item-label`} style={props.labelStyle || {}}>
              {props.label || ''}
            </div>
          </div>
        </div>
        {(iconPosition === 'right' || iconPosition === 'bottom') && iconElement}
      </div>
      {(chartPosition === 'right' || chartPosition === 'bottom') && chartElement}
    </div>
  );
};

export interface IDataOverviewCard {
  data: IDataItem[];
  columns?: number;
  margin?: number | [number, number];
  direction?: 'row' | 'column';
}

export const Wnumberoverview: React.FC<IDataOverviewCard> = (props) => {
  const marginRight = props?.margin === 0 || props?.margin?.[1] === 0 ? 0 : props?.margin?.[1] || props?.margin || 8;
  const marginBottom = props?.margin === 0 || props?.margin?.[0] === 0 ? 0 : props?.margin?.[0] || props?.margin || 8;

  const maxWidth = Math.max(...props.data.map(calcCardMinWidth));

  const container = useRef(null);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    if (props.direction === 'column') {
      setColumns(1);
    } else if (props.columns) {
      setColumns(props.columns);
    } else {
      calcColumns();
    }

    window.addEventListener('resize', calcColumns);

    return () => {
      window.removeEventListener('resize', calcColumns);
    };
  }, [props]);

  const calcColumns = () => {
    if (props.direction === 'column' || props.columns) {
      return;
    }
    const width = container.current.parentNode.offsetWidth;
    const itemsPerRow = Math.max(Math.floor(width / maxWidth), 1);
    setColumns(itemsPerRow);
  };

  const itemWidth =
    props?.direction === 'column' ? '100%' : `calc((100% - ${marginRight * (columns - 1)}px) / ${columns})`;

  const dataByRow = [];
  for (let index = 0; index < props.data?.length; index += columns) {
    dataByRow.push(props.data.slice(index, index + columns));
  }

  return (
    <div
      className={`${prefix}-data-overview-container`}
      ref={container}
      style={{
        flexDirection: props?.direction || 'row',
      }}
    >
      {dataByRow.map((row: IDataItem[], rowIndex: number) => (
        <div
          key={rowIndex}
          className={`${prefix}-data-overview-row`}
          style={{ marginBottom: rowIndex === dataByRow.length - 1 ? 0 : marginBottom }}
        >
          {row.map((item: IDataItem, colIndex: number) => {
            const itemProps = {
              ...item,
              itemStyle: {
                height: 68,
                width: itemWidth,
                minWidth: props.columns ? 0 : maxWidth,
                marginRight: colIndex === columns - 1 ? 0 : marginRight,
                ...(item?.itemStyle ?? {}),
              },
            };
            return <Wnumbercard {...itemProps} key={rowIndex * columns + colIndex} />;
          })}
        </div>
      ))}
    </div>
  );
};

// 计算卡片宽度
function calcCardMinWidth(cardProps: IDataItem) {
  // 既有icon又有图表，默认最大尺寸
  if (cardProps.chart && cardProps.icon) {
    return 608;
  }
  // 只有图表没有icon
  else if (cardProps.chart) {
    return 401;
  }
  // 只有icon
  else if (cardProps.icon) {
    return 296;
  } else {
    return 192;
  }
}
