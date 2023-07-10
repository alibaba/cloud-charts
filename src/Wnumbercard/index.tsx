// @ts-ignore
/* eslint-disable @typescript-eslint/brace-style */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useRef, Fragment, useMemo, useCallback } from 'react';
import Wline, { WlineConfig } from '../Wline';
import Wcircle, { WcircleProps } from '../Wcircle';
import { beautifyNumber } from '../common/common';
import { FullCrossName, PrefixName } from '../constants';
import themes from '../themes/index';
import './index.scss';

const prefix = `${PrefixName}-wnumbercard`;

export interface LineProps {
  type: 'Wline';
  data: any[];
  // 宽度，默认100
  width?: number | string;
  // 高度，默认40
  height?: number | string;
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

export interface IDataItem {
  /** 标签，超出长度自动省略并显示tooltip */
  label: string | React.ReactNode;

  /** 数值 */
  value?: number | string | React.ReactNode;

  /** 单位 */
  unit?: string; // 是否居中？

  /** 业务状态，默认default */
  status?: Status;

  /** icon */
  icon?: React.ReactNode;

  /** 卡片中的value字号尺寸，默认medium */
  size?: 'small' | 'medium';

  /** 背景类型，默认fill */
  backgroundType?: 'fill' | 'none' | 'image';

  /** 背景图,image时必传 */
  backgroundImage?: string;

  /** icon位置，默认右边 */
  iconPosition?: 'left' | 'right';

  /** label旁边的tags */
  labelTags: LabelTagProps[];

  /** value旁边的tags */
  valueTags?: ValueTagProps[];

  /** 图表，支持线图、圆环图与RN */
  chart?: LineProps | CircleProps | React.ReactNode;

  /** 各种自定义样式，隐藏 */
  itemStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  valueStyle?: React.CSSProperties;

  /* 其他附加数据项，如onClick事件 */
  [key: string]: any;
}

export const Wnumbercard: React.FC<IDataItem> = (props) => {
  const {
    label,
    value,
    unit,
    status,
    icon,
    size = 'medium',
    backgroundImage,
    iconPosition = 'left',
    labelTags = [],
    valueTags = [],
    chart,
    itemStyle,
    labelStyle,
    valueStyle,
    ...otherProps
  } = props || {};
  let { backgroundType } = props || {};

  // 设置背景类型默认值
  if (!backgroundType) {
    // 有minichart的卡片默认灰色
    if (chart) {
      backgroundType = 'fill';
    } else {
      backgroundType = 'none';
    }
  }

  const chartPosition = chart?.position || 'right';

  const labelRef = useRef<HTMLDivElement>(null);

  // label是否超过宽度，需要使用tooltip
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // 是否显示tooltip
  const [visible, setVisible] = useState<boolean>(false);

  // 颜色转换
  const transformColor = (status: Status) => {
    if (status === 'normal') {
      return {
        color: themes['widgets-color-normal'],
        bgColor: themes['widgets-color-bg-normal'],
      };
    } else if (status === 'warning') {
      return {
        color: themes['widgets-color-orange'],
        bgColor: themes['widgets-color-bg-orange'],
      };
    } else if (status === 'error') {
      return {
        color: themes['widgets-color-red'],
        bgColor: themes['widgets-color-bg-red'],
      };
    } else if (status === 'success') {
      return {
        color: themes['widgets-color-green'],
        bgColor: themes['widgets-color-bg-green'],
      };
    } else if (status === 'help') {
      return {
        color: themes['widgets-color-yellow'],
        bgColor: themes['widgets-color-bg-yellow'],
      };
    } else if (status === 'mention') {
      return {
        color: themes['widgets-color-purple'],
        bgColor: themes['widgets-color-bg-purple'],
      };
    } else if (status === 'p1') {
      return {
        color: themes['widgets-color-p1'],
        bgColor: themes['widgets-color-bg-p1'],
      };
    } else if (status === 'p2') {
      return {
        color: themes['widgets-color-p2'],
        bgColor: themes['widgets-color-bg-p2'],
      };
    } else if (status === 'p3') {
      return {
        color: themes['widgets-color-p3'],
        bgColor: themes['widgets-color-bg-p3'],
      };
    } else if (status === 'p4') {
      return {
        color: themes['widgets-color-p4'],
        bgColor: themes['widgets-color-bg-p4'],
      };
    } else if (status === 'p5') {
      return {
        color: themes['widgets-color-p5'],
        bgColor: themes['widgets-color-bg-p5'],
      };
    } else if (status === 'p6') {
      return {
        color: themes['widgets-color-p6'],
        bgColor: themes['widgets-color-bg-p6'],
      };
    } else if (status === 'p7') {
      return {
        color: themes['widgets-color-p7'],
        bgColor: themes['widgets-color-bg-p7'],
      };
    } else {
      return {
        color: themes['widgets-color-text-2'],
        bgColor: themes['widgets-numbercard-color-hover'],
      };
    }
  };

  // icon
  const iconElement = icon && React.isValidElement(icon) ? icon : false;

  // label tags
  const labelTagElements = labelTags.map((tag: LabelTagProps, index: number) => {
    const { color, bgColor } = transformColor(tag?.status);
    return (
      <div key={index} className={`${prefix}-label-tag`} style={{ background: bgColor }}>
        <span className={`${prefix}-tag-value`} style={{ color }}>
          {tag?.text}
        </span>
      </div>
    );
  });

  // value tags
  const valueTagElements = valueTags.map((tag: ValueTagProps, index: number) => {
    const { color, bgColor } = transformColor(tag?.status);
    return (
      <div key={index} className={`${prefix}-value-tag`} style={{ background: bgColor }}>
        {tag?.trend === 'down' && (
          <svg fill={color} className={`${prefix}-tag-trend`}>
            <polygon points="0,2 10,2 5,10" />
          </svg>
        )}
        {tag?.trend === 'up' && (
          <svg fill={color} className={`${prefix}-tag-trend`}>
            <polygon points="0,10 10,10 5,2" />
          </svg>
        )}
        <span className={`${prefix}-tag-value`} style={{ color }}>
          {tag?.text}
        </span>
      </div>
    );
  });

  // 线图
  const lineChart = chart?.type === 'Wline' && (
    <Wline
      data={chart?.data || []}
      width={chart?.width || null}
      height={chart?.height || 44}
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
        marginLeft: chartPosition === 'right' ? 20 : 0,
        marginRight: chartPosition === 'left' ? 20 : 0,
        marginTop: chartPosition === 'bottom' ? 20 : 0,
        marginBottom: chartPosition === 'top' ? 20 : 0,
      }}
    >
      {chartElement}
    </div>
  );

  // tooltip
  const labelTooltip = visible && (
    <div
      className={`${prefix}-tooltip`}
      style={{
        position: 'absolute',
        top: labelRef?.current?.offsetTop + 20,
        left: Math.max(
          0,
          labelRef?.current?.offsetLeft + (labelRef?.current?.offsetWidth - labelRef?.current?.scrollWidth) / 2,
        ),
      }}
    >
      <div className={`${prefix}-tooltip-arrow`} style={{ position: 'absolute' }}>
        <div className={`${prefix}-arrow-content`} style={{ position: 'absolute' }} />
      </div>
      <div className={`${prefix}-tooltip-content`}>{label || ''}</div>
    </div>
  );

  // css变量
  const cssVariables = {
    '--background-color': backgroundType === 'none' ? 'transparent' : themes['widgets-color-container-background'],
    '--hover-color': props?.onClick
      ? backgroundType === 'fill'
        ? themes['widgets-numbercard-color-hover']
        : backgroundType === 'none'
        ? themes['widgets-color-container-background']
        : themes['widgets-color-container-background']
      : backgroundType === 'none'
      ? 'transparent'
      : themes['widgets-color-container-background'],
    '--click-color': props?.onClick
      ? backgroundType !== 'image'
        ? themes['widgets-numbercard-color-click']
        : themes['widgets-color-container-background']
      : backgroundType === 'none'
      ? 'transparent'
      : themes['widgets-color-container-background'],
    '--value-color':
      !status || status === 'default' ? themes['widgets-numbercard-color-text'] : transformColor(status).color,
    '--value-fontsize': size === 'medium' ? themes['widgets-font-size-5'] : themes['widgets-font-size-3'],
  };

  // 判断label是否超过宽度
  useEffect(() => {
    setShowTooltip(labelRef?.current?.offsetWidth !== labelRef?.current?.scrollWidth);
  }, [labelRef?.current?.offsetWidth, labelRef?.current?.scrollWidth]);

  // 显示tooltip事件
  useEffect(() => {
    if (!labelRef?.current) {
      return;
    }

    const handleMouseEnter = () => {
      if (showTooltip) {
        setVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    labelRef?.current?.addEventListener('mouseenter', handleMouseEnter);
    labelRef?.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      labelRef?.current?.removeEventListener('mouseenter', handleMouseEnter);
      labelRef?.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [labelRef?.current]);

  return (
    <div
      className={`${FullCrossName} ${prefix}-data-item-container`}
      style={{
        ...cssVariables,
        backgroundImage: backgroundType === 'image' ? `url(${backgroundImage})` : 'none',
        ...(itemStyle || {}),
        flexDirection: chartPosition === 'left' || chartPosition === 'right' ? 'row' : 'column',
        padding: chartPosition === 'bottom' ? '16px 20px 20px 16px' : '12px 16px',
        cursor: props?.onClick ? 'pointer' : 'default',
      }}
      {...otherProps}
    >
      {(chartPosition === 'left' || chartPosition === 'top') && chartContainer}
      <div
        className={`${prefix}-item-content`}
        style={{
          justifyContent: chartElement && chartPosition === 'left' ? 'flex-end' : 'space-between',
          alignItems: chartElement && chartPosition === 'bottom' ? 'flex-start' : 'center',
          alignSelf: chartElement && chartPosition === 'left' ? 'flex-end' : 'flex-start',
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
              marginBottom: value || value === 0 ? (chartPosition === 'bottom' ? 20 : 8) : 0,
              ...(labelStyle || {}),
            }}
          >
            <div className={`${prefix}-item-label`} ref={labelRef}>
              {label || ''}
            </div>
            {labelTooltip}
            {labelTagElements?.length > 0 && <div className={`${prefix}-tag-container`}>{labelTagElements}</div>}
          </div>
          <div className={`${prefix}-label-value-container`} style={valueStyle || {}}>
            <div className={`${prefix}-item-value`}>
              {typeof value === 'number' ? (
                <span className={`${prefix}-value-number`}>{beautifyNumber(value || 0, ',')}</span>
              ) : typeof value === 'string' ? (
                <span className={`${prefix}-value-number`}>{value}</span>
              ) : (
                value
              )}

              {unit && <div className={`${prefix}-item-unit`}>{unit}</div>}
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
}

export const Wnumberoverview: React.FC<IDataOverviewCard> = (props) => {
  const {
    data = [],
    columns: userColumns,
    margin = 16,
    showDivider: userShowDivider,
    backgroundType: userBackgroundType,
    size = 'medium',
  } = props || {};

  const marginRight = typeof margin === 'number' ? margin : margin[1];
  const marginBottom = typeof margin === 'number' ? margin : margin[0];

  const maxWidth = Math.max(...data.map(calcCardMinWidth));

  const container = useRef(null);
  const [columns, setColumns] = useState(1);

  const [containerWidth, setContainerWidth] = useState<number>(0);

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

    window.addEventListener('resize', calcColumns);

    return () => {
      window.removeEventListener('resize', calcColumns);
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

  const chartWidth = Math.max(62, itemWidth / 3);

  const dataByRow = [];
  for (let index = 0; index < data?.length; index += columns) {
    dataByRow.push(data.slice(index, index + columns));
  }

  return (
    <div
      className={`${FullCrossName} ${prefix}-data-overview-container`}
      ref={container}
      style={{
        flexDirection: 'row',
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
              backgroundType,
              size,
              ...item,
              ...(item.chart && !React.isValidElement(item.chart)
                ? {
                    chart: {
                      ...item.chart,
                      width: chartWidth,
                    },
                  }
                : {}),
              itemStyle: {
                height: 68,
                width: itemWidth,
                marginRight: colIndex === columns - 1 ? 0 : marginRight / 2,
                marginLeft: colIndex === 0 ? 0 : marginRight / 2,
                ...(item?.itemStyle ?? {}),
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
