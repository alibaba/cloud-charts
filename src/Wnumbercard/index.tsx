// @ts-ignore
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef } from 'react';
import Wline, { WlineConfig } from '../Wline';
import Wcircle, { WcircleProps } from '../Wcircle';
import { beautifyNumber } from '../common/common';
import { FullCrossName, PrefixName } from '../constants';
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
  config?: WcircleProps;
}

// export interface IDataItem {
//   label: string | React.ReactNode;
//   // hideTooltip?: boolean;
//   // labelTooltip?: string | React.ReactNode;
//   // tooltipIcon?: React.ReactNode;
//   value?: number | string | React.ReactNode;
//   unit?: string;
//   status?: 'working' | 'success' | 'warning' | 'error';
//   icon?: React.ReactNode;

//   iconPosition?: 'left' | 'right' | 'top' | 'bottom';

//   itemStyle?: React.CSSProperties;
//   labelStyle?: React.CSSProperties;
//   valueStyle?: React.CSSProperties;
//   statusStyle?: React.CSSProperties;

//   trend?: number;
//   chart?: LineProps | CircleProps | React.ReactNode;
//   onClick?: React.MouseEventHandler;
// }

// todo: 提出去
type Status =
  | 'normal'
  | 'warning'
  | 'error'
  | 'success'
  | 'mention'
  | 'help'
  | 'disabled'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'
  | 'p5'
  | 'p6'
  | 'p7';

interface TagProps {
  /** tag上的文字 */
  text: string;

  /** 上三角与下三角 */
  trend?: 'up' | 'down';

  /** tag的状态，默认为normal */
  status?: Status;
}

export interface IDataItem {
  /** 标签，超出长度自动省略并显示tooltip */
  label: string | React.ReactNode;

  /** 数值 */
  value?: number | string | React.ReactNode;

  /** 单位 */
  unit?: string; // 是否居中？

  /** 业务状态 */
  status?: Status;

  /** icon */
  icon?: React.ReactNode;

  /** 背景类型，默认fill */
  backgroundType?: 'fill' | 'none' | 'image';

  /** 背景图,image时必传 */
  backgroundImage?: string;

  /** icon位置，默认右边 */
  iconPosition?: 'left' | 'right';

  /** tags */
  tags?: TagProps[];

  /** tag最多展示几个，默认全部 */
  tagMaxNumber?: number;

  /** 图表，支持线图、圆环图与RN */
  chart?: LineProps | CircleProps | React.ReactNode;

  /** 各种自定义样式，隐藏 */
  itemStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;
  statusStyle?: React.CSSProperties;
}

export const Wnumbercard: React.FC<IDataItem> = (props) => {
  const iconPosition = props?.iconPosition || 'right';
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
  );

  const circleChart = props?.chart?.type === 'circle' && (
    <Wcircle percent={props?.chart?.data || 0} {...{ radius: 22, ...props?.chart?.config }} />
  );

  const chartElement = (React.isValidElement(props?.chart) && props.chart) || lineChart || circleChart;

  const chartContainer = chartElement && (
    <div
      className={`${prefix}-item-chart`}
      style={{
        justifyContent: chartPosition === 'right' ? 'flex-end' : 'flex-start',
        marginLeft: chartPosition === 'right' ? 8 : 0,
        marginRight: chartPosition === 'left' ? 8 : 0,
        marginTop: chartPosition === 'bottom' ? 8 : 0,
        marginBottom: chartPosition === 'top' ? 8 : 0,
      }}
    >
      {chartElement}
    </div>
  );

  return (
    <div
      className={`${FullCrossName} ${prefix}-data-item-container`}
      style={{
        ...(props?.itemStyle || {}),
        flexDirection: chartPosition === 'left' || chartPosition === 'right' ? 'row' : 'column',
      }}
      onClick={(event: any) => {
        props?.onClick?.(event);
      }}
    >
      {(chartPosition === 'left' || chartPosition === 'top') && chartContainer}
      <div
        className={`${prefix}-item-content`}
        style={{
          flexDirection: iconPosition === 'left' || iconPosition === 'right' ? 'row' : 'column',
          justifyContent: chartElement && chartPosition === 'left' ? 'flex-end' : 'space-between',
          alignItems: chartElement && chartPosition === 'bottom' ? 'flex-start' : 'center',
          alignSelf: chartElement && chartPosition === 'left' ? 'flex-end' : 'flex-start',
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
              ) : typeof props.value === 'string' ? (
                <span className={`${prefix}-value-number ${prefix}-number`}>{props.value}</span>
              ) : (
                props.value
              )}

              {props.unit && <div className={`${prefix}-item-unit`}>{props.unit}</div>}
              {trendChart}
            </div>
          </div>
          <div className={`${prefix}-item-label-container`} style={{ marginTop: props.value !== undefined ? 8 : 0 }}>
            <div className={`${prefix}-item-label`} style={props.labelStyle || {}}>
              {props.label || ''}
            </div>
          </div>
        </div>
        {(iconPosition === 'right' || iconPosition === 'bottom') && iconElement}
      </div>
      {(chartPosition === 'right' || chartPosition === 'bottom') && chartContainer}
    </div>
  );
};

export interface IDataOverviewCard {
  data: IDataItem[];

  /** 列数，columns=1表示竖着排 */
  columns?: number;
  margin?: number | [number, number];

  /** 是否显示竖线,默认不显示，columns=1时不显示 */
  showDivider?: boolean;
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
