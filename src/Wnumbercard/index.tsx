// @ts-ignore
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import Wline, { WlineConfig } from '../Wline';
import Wcircle, { WcircleProps } from '../Wcircle';
import { beautifyNumber } from '../common/common';
import { FullCrossName, PrefixName } from '../constants';
import WidgetsTooltip from '../common/Tooltip';
import classNames from 'classnames';
import chartLog from '../common/log';
import { GlobalResizeObserver } from '../common/globalResizeObserver';
import { unitConversion, customFormatterConfig } from '../common/common';
import './index.scss';

const prefix = `${PrefixName}-wnumbercard`;

export interface LineProps {
  type: 'Wline';
  data: any[];
  // 宽度，默认100
  width?: number | string;
  // 高度，默认40
  height?: number | string;

  // 位置
  position?: 'left' | 'right' | 'top' | 'bottom';
  config?: WlineConfig;
}

export interface CircleProps {
  type: 'Wcircle';
  data: number;
  position?: 'left' | 'right' | 'top' | 'bottom';
  config?: WcircleProps;
}

// todo: 提出去
type Status =
  | 'default'
  | 'normal'
  | 'warning'
  | 'error'
  | 'success'
  | 'mention'
  | 'help'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'
  | 'p5'
  | 'p6'
  | 'p7';

interface LabelTagProps {
  /** tag上的文字 */
  text: string;

  /** tag的状态，默认default */
  status?: Status;
}

interface ValueTagProps extends LabelTagProps {
  /** 上三角与下三角 */
  trend?: 'up' | 'down';
}

interface IConfig extends customFormatterConfig {
  /** 指标卡的label和value的位置，默认左边 */
  position?: 'left' | 'center';

  /** 业务状态，默认default */
  status?: Status;

  /** icon */
  icon?: React.ReactNode;

  /** 卡片中的value字号尺寸，默认medium */
  size?: 'small' | 'medium';

  /** 背景类型，灰色/透明/背景图片，有图表时默认fill，无图表时默认none */
  backgroundType?: 'fill' | 'none' | 'image';

  /** 背景图,image时必传 */
  backgroundImage?: string;

  /** icon位置，默认左边 */
  iconPosition?: 'left' | 'right' | 'top-left';

  /** label旁边的tags */
  labelTags?: LabelTagProps[];

  /** value旁边的tags */
  valueTags?: ValueTagProps[];

  /** 图表，支持线图、圆环图与RN */
  chart?: LineProps | CircleProps | React.ReactNode;

  /** 右上角操作 */
  extra?: React.ReactNode;

  /** 右上角操作的显示逻辑，默认none，一直展示 */
  extraTriggerType?: 'hover' | 'none';

  /** 各种自定义样式，隐藏 */
  itemStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;

  /* 其他附加数据项，如onClick事件 */
  [key: string]: any;
}

export interface IDataItem {
  data: {
    /** 标签，超出长度自动省略并显示tooltip */
    label: string | React.ReactNode;

    /** 数值 */
    value?: number | string | React.ReactNode;

    /** 单位 */
    unit?: string; // 是否居中？
  };

  config?: IConfig;
}

export const Wnumbercard: React.FC<IDataItem> = (props) => {
  // 兼容老api
  const { label, value, unit } = { ...props, ...props?.data };

  const {
    position = 'left',
    status,
    icon,
    size = 'medium',
    backgroundType: userBackgroundType,
    backgroundImage,
    iconPosition = 'left',
    extra,
    extraTriggerType = 'none',
    labelTags = [],
    valueTags = [],
    chart,
    itemStyle,
    labelStyle,
    valueStyle,
    needUnitTransform,
    decimal,
    unitTransformTo,
    valueType,
    customCarryUnits,
    customCarryThreshold,
    addonTextAfter,
    ...otherProps
  } = { ...props, ...props?.config };

  let current = value;
  let finalUnit = unit;
  if (needUnitTransform && valueType) {
    if (valueType === 'percent_1' && typeof current === 'number') {
      current = current * 100;
    }
    const { value, unit: transformUnit } = unitConversion(
      current,
      unit,
      decimal,
      unitTransformTo,
      valueType,
      customCarryUnits,
      customCarryThreshold,
      addonTextAfter,
    );
    current = value;
    finalUnit = transformUnit;
  }

  // 有minichart的卡片默认灰色
  const backgroundType = userBackgroundType ? userBackgroundType : chart ? 'fill' : 'none';

  const chartPosition = chart?.position || 'right';

  const labelRef = useRef<HTMLDivElement>(null);
  const extraRef = useRef<HTMLDivElement>(null);

  const [extraWidth, setExtraWidth] = useState<number>(0);

  // icon
  const iconElement = icon && React.isValidElement(icon) ? icon : false;

  useEffect(() => {
    // 图表初始化时记录日志
    chartLog('Wnumbercard', 'init');
  }, []);

  // label tags
  const labelTagElements = labelTags.map((tag: LabelTagProps, index: number) => {
    return (
      <div key={index} className={`${prefix}-label-tag ${prefix}-tag-item ${tag.status || 'default'}`}>
        <span className={`${prefix}-tag-value`}>{tag?.text}</span>
      </div>
    );
  });

  // value tags
  const valueTagElements = valueTags.map((tag: ValueTagProps, index: number) => {
    return (
      <div key={index} className={`${prefix}-value-tag ${prefix}-tag-item ${tag.status || 'default'}`}>
        {tag?.trend === 'down' && (
          <svg className={`${prefix}-tag-trend`}>
            <polygon points="0,2 10,2 5,10" />
          </svg>
        )}
        {tag?.trend === 'up' && (
          <svg className={`${prefix}-tag-trend`}>
            <polygon points="0,10 10,10 5,2" />
          </svg>
        )}
        <span className={`${prefix}-tag-value`}>{tag?.text}</span>
      </div>
    );
  });

  // 线图
  const lineChart = chart?.type === 'Wline' && (
    <Wline
      data={chart?.data || []}
      width={chart?.width || null}
      height={chart?.height || null}
      config={{
        xAxis: {
          visible: false,
        },
        yAxis: {
          visible: false,
        },
        legend: false,
        tooltip: false,
        ...chart?.config,
      }}
      force
    />
  );

  // 圆环图
  const circleChart = chart?.type === 'Wcircle' && (
    <Wcircle percent={chart?.data || 0} {...{ radius: 22, ...chart?.config }} />
  );

  const chartElement = (React.isValidElement(chart) && chart) || lineChart || circleChart;

  const chartContainer = chartElement && (
    <div
      className={`${prefix}-item-chart`}
      style={{
        justifyContent: chartPosition === 'right' ? 'flex-end' : 'flex-start',
        marginLeft: chartPosition === 'right' ? 8 : 0,
        marginRight: chartPosition === 'left' ? 8 : 0,
        marginTop: chartPosition === 'bottom' ? 8 : 0,
        marginBottom: chartPosition === 'top' ? 8 : 0,
        height: ['top', 'bottom'].includes(chartPosition)
          ? `calc(100% - ${label && value !== undefined ? 58 : 26}px)`
          : '100%',
      }}
    >
      {chartElement}
    </div>
  );

  const mainClasses = classNames(prefix, {
    [FullCrossName]: true,
    [prefix + '-data-item-container']: true,
    [prefix + '-none-card']: backgroundType === 'none',
    [prefix + '-fill-card']: backgroundType === 'fill',
    [prefix + '-image-card']: backgroundType === 'image',
    [prefix + '-clickable']: !!otherProps?.onClick,
  });

  useEffect(() => {
    if (!extraRef.current) {
      return;
    }
    setExtraWidth(extraRef?.current?.offsetWidth);
  }, [extra]);

  return (
    <div
      className={mainClasses}
      style={{
        backgroundImage: backgroundType === 'image' ? `url(${backgroundImage})` : 'none',
        minHeight: label && value !== undefined ? 68 : !label && value !== undefined ? 48 : 42,
        flexDirection: chartPosition === 'left' || chartPosition === 'right' ? 'row' : 'column',
        padding: chartPosition === 'bottom' ? '16px 12px' : '12px 16px',
        ...(itemStyle || {}),
      }}
      {...otherProps}
    >
      {(chartPosition === 'left' || chartPosition === 'top') && chartContainer}
      <div
        className={position === 'center' ? `${prefix}-item-content-center` : `${prefix}-item-content`}
        style={{
          justifyContent: chartElement && chartPosition === 'left' ? 'flex-end' : 'space-between',
          alignItems: chartElement && chartPosition === 'bottom' ? 'flex-start' : 'center',
          alignSelf: chartElement && chartPosition === 'left' ? 'flex-end' : 'flex-start',
          width:
            chartElement && ['left', 'right'].includes(chartPosition)
              ? `calc(100% - ${
                  (chart?.type === 'Wcircle' ? (chart?.config?.radius ?? 22) * 2 : chart?.width ?? 0) + 20
                }px)`
              : '100%',
        }}
      >
        {iconPosition === 'left' && iconElement}
        <div
          className={`${prefix}-main-content`}
          style={{ marginLeft: iconElement && iconPosition === 'left' ? 16 : 0 }}
        >
          <div
            className={`${prefix}-item-label-container`}
            style={{
              marginBottom: value || value === 0 || (chart && chartPosition === 'bottom') ? 8 : 0,
            }}
          >
            <div
              className={`${prefix}-item-label-left`}
              style={{
                maxWidth: extra ? `calc(100% - ${extraWidth + 8}px)` : '100%',
              }}
            >
              {iconPosition === 'top-left' && iconElement && (
                <div className={`${prefix}-top-left-icon`}>{iconElement}</div>
              )}
              <div className={`${prefix}-item-label`} ref={labelRef} style={labelStyle || {}}>
                {label || ''}
              </div>
              <WidgetsTooltip ref={labelRef} content={label || ''} position="top" />
              {labelTagElements?.length > 0 && <div className={`${prefix}-tag-container`}>{labelTagElements}</div>}
            </div>
            {extra && React.isValidElement(extra) && (
              <div
                className={`${prefix}-item-label-right ${
                  extraTriggerType === 'hover' ? `${prefix}-item-label-right-hidden` : ''
                }`}
                ref={extraRef}
              >
                {extra}
              </div>
            )}
          </div>
          <div className={`${prefix}-label-value-container`}>
            <div className={`${prefix}-item-value`}>
              {typeof value === 'number' ? (
                <div
                  className={`${prefix}-value-number ${prefix}-${status || 'default'} ${size || 'medium'}`}
                  style={valueStyle || {}}
                >
                  {beautifyNumber(current || 0, ',')}
                </div>
              ) : typeof value === 'string' ? (
                <div
                  className={`${prefix}-value-number ${prefix}-${status || 'default'} ${size || 'medium'}`}
                  style={valueStyle || {}}
                >
                  {value}
                </div>
              ) : (
                value
              )}

              {finalUnit && (
                <div
                  className={`${prefix}-item-unit ${prefix}-${status || 'default'}`}
                  style={{
                    marginBottom: React.isValidElement(value) || isNaN(Number(value)) ? 0 : size === 'small' ? 1 : 2,
                  }}
                >
                  {finalUnit}
                </div>
              )}
              {valueTagElements?.length > 0 && <div className={`${prefix}-tag-container`}>{valueTagElements}</div>}
            </div>
          </div>
        </div>
        {iconPosition === 'right' && iconElement}
      </div>
      {(chartPosition === 'right' || chartPosition === 'bottom') && chartContainer}
    </div>
  );
};

export interface IDataOverviewCard {
  data: IDataItem[];

  config?: {
    /** 列数，columns=1表示竖着排，不指定则自适应 */
    columns?: number;

    /** 间距，默认16 */
    margin?: number | [number, number];

    /** 是否显示竖线,不指定则根据backgroundType自动判断 */
    showDivider?: boolean;

    // 整体的卡片类型，不指定则根据卡片内容、行数自动判断
    backgroundType?: 'fill' | 'none' | 'image';

    /** 整体的卡片尺寸，默认medium */
    size?: 'small' | 'medium';
  };
}

export const Wnumberoverview: React.FC<IDataOverviewCard> = (props) => {
  const { data = [] } = props || {};

  const {
    columns: userColumns,
    margin = 16,
    showDivider: userShowDivider,
    backgroundType: userBackgroundType,
    size = 'medium',
  } = { ...props, ...props?.config };

  const marginRight = typeof margin === 'number' ? margin : margin[1];
  const marginBottom = typeof margin === 'number' ? margin : margin[0];

  const maxWidth = Math.max(...data.map(calcCardMinWidth));

  const container = useRef(null);
  const [columns, setColumns] = useState(1);

  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    // 图表初始化时记录日志
    chartLog('Wnumberoverview', 'init');
  }, []);

  const calcColumns = useCallback(() => {
    const width = container?.current?.offsetWidth || 0;
    setContainerWidth(width);

    // 用户设置了列数则直接用
    if (userColumns) {
      setColumns(userColumns);
      return;
    }

    // 每行几个卡片，最少2个，最多6个
    const itemsPerRow = Math.min(Math.max(Math.min(Math.floor(width / maxWidth), data?.length || 0), 2), 6);
    setColumns(itemsPerRow);
  }, [userColumns, data]);

  useEffect(() => {
    calcColumns();

    const parent = container.current && container.current.parentElement;
    if (parent) {
      GlobalResizeObserver.observe(parent, calcColumns);
    }

    return () => {
      const parent = container.current && container.current.parentElement;
      if (parent) {
        GlobalResizeObserver.unobserve(parent);
      }
    };
  }, [calcColumns]);

  // 卡片背景样式
  const [backgroundType, setBackgroundType] = useState<any>(undefined);

  // 计算默认的backgroundType
  useEffect(() => {
    // 用户指定了backgroundType就直接用
    if (userBackgroundType) {
      setBackgroundType(userBackgroundType);
      return;
    }

    if (data.some((item: IDataItem) => item.backgroundType)) {
      // 任意卡片指定了backgroundType则不做处理
      setBackgroundType(undefined);
    } else if (data.some((item: IDataItem) => item.icon)) {
      // 任意卡片有icon 则默认用白色卡片
      setBackgroundType('none');
    } else {
      setBackgroundType('fill');
    }
  }, [data, userBackgroundType]);

  // 是否加间隔线
  const showDivider = userShowDivider !== undefined ? userShowDivider : backgroundType === 'none';

  const itemWidth = (containerWidth - (marginRight + (showDivider ? 1 : 0)) * (columns - 1)) / columns;

  // 当任意卡片有图表（不在左右）时，高度100%，否则68
  const itemHeight = data.some((item: IDataItem) => {
    const chart = item?.config?.chart ?? item?.chart;
    if (chart && chart?.position !== 'left' && chart?.position !== 'right') {
      return true;
    }
    return false;
  })
    ? '100%'
    : 68;

  const chartWidth = Math.max(62, itemWidth / 3);

  const dataByRow = [];
  for (let index = 0; index < data?.length; index += columns) {
    dataByRow.push(data.slice(index, index + columns));
  }

  return (
    <div
      className={`${FullCrossName} ${prefix}-data-overview-container ${backgroundType}`}
      ref={container}
      style={{
        flexDirection: 'row',
      }}
    >
      {dataByRow.map((row: IDataItem[], rowIndex: number) => (
        <div
          key={rowIndex}
          className={`${prefix}-data-overview-row`}
          style={{
            marginBottom: rowIndex === dataByRow.length - 1 ? 0 : marginBottom,
            height: `${100 / dataByRow?.length}%`,
            minHeight: 68,
          }}
        >
          {row.map((item: IDataItem, colIndex: number) => {
            const { data, config, ...others } = item || {};
            const chart = config?.chart ?? others?.chart;

            const itemProps = {
              data: {
                label: data?.label ?? others?.label,
                value: data?.value ?? others?.value,
                unit: data?.unit ?? others?.unit,
              },
              config: {
                backgroundType,
                size,
                ...others,
                ...config,
                ...(chart && !React.isValidElement(chart)
                  ? {
                      chart: {
                        ...chart,
                        width: ['top', 'bottom'].includes(chart?.position) ? null : chartWidth,
                      },
                    }
                  : {}),
                itemStyle: {
                  height: itemHeight,
                  width: itemWidth,
                  marginRight: colIndex === columns - 1 ? 0 : marginRight / 2,
                  marginLeft: colIndex === 0 ? 0 : marginRight / 2,
                  ...(config?.itemStyle ?? others?.itemStyle),
                },
              },
            };
            return (
              <Fragment key={rowIndex * columns + colIndex}>
                <Wnumbercard {...itemProps} />
                {colIndex !== row.length - 1 && showDivider && <div className={`${prefix}-divider`} />}
              </Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// 计算卡片宽度
function calcCardMinWidth(cardProps: IDataItem) {
  if (cardProps.icon) {
    return 172;
  }

  return 92;
}
