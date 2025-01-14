// @ts-ignore
import React, { Fragment, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IDataItem, Wnumbercard } from '../Wnumbercard';
import Wgauge, { IWgaugeProps } from '../Wgauge';
import { GlobalResizeObserver } from '../common/globalResizeObserver';
import { FullCrossName, PrefixName } from '../constants';
import Wplaceholder from '../Wplaceholder';
import './index.scss';

const prefix = `${PrefixName}-list-container`;

export interface ListContainerProps {
  /** 图表的数据（数组） */
  data: IDataItem[] | IWgaugeProps[];

  config?: {
    /** 内部的图表，目前仅支持仪表盘及指标卡 */
    chart: 'Wnumbercard' | 'Wgauge';

    /** 列数，columns=1表示竖着排，不指定则自适应 */
    columns?: number;

    /** 间距，默认16 */
    margin?: number | [number, number];

    /** 是否显示竖线,不指定则根据图表自动判断 */
    showDivider?: boolean;

    /** 其余配置项，会透传到内部图表中 */
    [key: string]: any;
  };
}

export default function ListContainer({ data, config: userConfig, ...others }: ListContainerProps) {
  if (!data?.length) {
    return <Wplaceholder empty />;
  }

  const { chart, columns: userColumns, margin = 16, fullSize = false, ...userOptions } = { ...others, ...userConfig };

  const marginRight = useMemo(() => (typeof margin === 'number' ? margin : margin[1]), [margin]);
  const marginBottom = useMemo(() => (typeof margin === 'number' ? margin : margin[0]), [margin]);

  const container = useRef<any>(null);
  const [columns, setColumns] = useState(1);

  const [containerWidth, setContainerWidth] = useState<number>(0);
  // const [containerHeight, setContainerHeight] = useState<number>(0);

  // 计算内部元素的最大宽度
  const maxWidth = useMemo(() => Math.max(...data.map((item) => calcMinWidth(chart, item))), [chart, data]);

  // 计算列数
  const calcColumns = useCallback(() => {
    const width = container?.current?.offsetWidth || 0;
    const height = container?.current?.offsetHeight || 0;
    setContainerWidth(width);
    // setContainerHeight(height);

    // 用户设置了列数则直接用
    if (userColumns) {
      setColumns(userColumns);
      return;
    }

    // 每行几个卡片，最少1个，最多6个
    const cols = Math.floor((width + marginRight) / (maxWidth + marginRight));
    const itemsPerRow = Math.min(Math.max(Math.min(cols, data?.length || 0), 1), 6);
    setColumns(itemsPerRow);
  }, [userColumns, maxWidth, marginRight]);

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

  // 获取配置项
  const config = getDefaultConfig(chart, data, userOptions);
  const { showDivider = false, ...otherConfig } = config;

  // const itemWidth = (containerWidth - (marginRight + (showDivider ? 1 : 0)) * (columns - 1)) / columns;
  const rows = Math.ceil((data?.length ?? 0) / columns);
  // const itemHeight = fullSize ? (containerHeight - marginBottom * (rows - 1)) / rows : calcMinHeight(chart, itemWidth);

  const dataByRow: any[] = [];
  for (let index = 0; index < data?.length; index += columns) {
    dataByRow.push(data.slice(index, index + columns));
  }

  return (
    <div className={`${FullCrossName} ${prefix}-container`} ref={container}>
      {dataByRow.map((row: any[], rowIndex: number) => {
        const itemWidth = (containerWidth - (marginRight + (showDivider ? 1 : 0)) * (row.length - 1)) / row.length;
        return (
          <div
            key={rowIndex}
            className={`${prefix}-row-container`}
            style={{
              height: `calc((100% - ${((showDivider ? 1 : 0) + marginBottom) * (rows - 1)}px) / ${rows} + ${
                (rowIndex === 0 ? 0 : marginBottom / 2) +
                (rowIndex === rows - 1 ? 0 : marginBottom / 2) +
                (showDivider && rowIndex !== rows - 1 ? 1 : 0)
              }px)`,
            }}
          >
            <div
              className={`${prefix}-row`}
              style={{
                marginBottom: rowIndex === rows - 1 ? 0 : marginBottom / 2,
                marginTop: rowIndex === 0 ? 0 : marginBottom / 2,
                height: `calc(100% - ${
                  (showDivider && rowIndex !== rows - 1 ? 1 : 0) +
                  (rowIndex === 0 ? 0 : marginBottom / 2) +
                  (rowIndex === rows - 1 ? 1 : marginBottom / 2)
                }px)`,
              }}
            >
              {row.map((item: IDataItem | IWgaugeProps, colIndex: number) => {
                const itemProps = {
                  ...otherConfig,
                  ...item,
                  ...getChartConfig(chart, item),
                };
                return (
                  <Fragment key={rowIndex * columns + colIndex}>
                    <div
                      style={{
                        marginRight: colIndex === row.length - 1 ? 0 : marginRight / 2,
                        marginLeft: colIndex === 0 ? 0 : marginRight / 2,
                        width: itemWidth,
                        height: '100%',
                      }}
                    >
                      {chart === 'Wnumbercard' && <Wnumbercard {...itemProps} />}
                      {chart === 'Wgauge' && <Wgauge {...itemProps} />}
                    </div>
                    {colIndex !== row.length - 1 && showDivider && <div className={`${prefix}-divider-column`} />}
                  </Fragment>
                );
              })}
            </div>
            {rowIndex !== dataByRow.length - 1 && showDivider && <div className={`${prefix}-divider-row`} />}
          </div>
        );
      })}
    </div>
  );
}

// 计算宽度
function calcMinWidth(chart: 'Wnumbercard' | 'Wgauge', item: IDataItem | IWgaugeProps) {
  if (chart === 'Wnumbercard') {
    if ((item as IDataItem).icon) {
      return 172;
    }

    return 92;
  } else {
    return 96;
  }
}

// 计算高度
function calcMinHeight(
  chart: 'Wnumbercard' | 'Wgauge',
  data: IDataItem[] | IWgaugeProps[],
  width: number,
  height: number,
) {
  if (chart === 'Wnumbercard') {
    // 当任意卡片有图表（不在左右）时，高度100%，否则68
    return data.some((item: IDataItem) => {
      const chart = item?.config?.chart ?? item?.chart;
      if (chart && chart?.position !== 'left' && chart?.position !== 'right') {
        return true;
      }
      return false;
    })
      ? height
      : 68;
  } else {
    return Math.round(width / 1.8);
  }
}

// 根据图表类型及数据获取默认配置项  容器级别
function getDefaultConfig(chart: 'Wnumbercard' | 'Wgauge', data: IDataItem[] | IWgaugeProps[], userOptions: any) {
  if (chart === 'Wnumbercard') {
    // 计算默认的backgroundType
    let backgroundType;

    // 用户指定了backgroundType就直接用
    if (userOptions?.backgroundType) {
      backgroundType = userOptions?.backgroundType;
    } else if ((data as IDataItem[]).some((item: IDataItem) => item.backgroundType)) {
      // 任意卡片指定了backgroundType则不做处理
      backgroundType = undefined;
    } else if ((data as IDataItem[]).some((item: IDataItem) => item.icon)) {
      // 任意卡片有icon 则默认用白色卡片
      backgroundType = 'none';
    } else {
      backgroundType = 'fill';
    }

    // 是否加间隔线
    const showDivider = userOptions?.showDivider !== undefined ? userOptions?.showDivider : backgroundType === 'none';

    return {
      ...userOptions,
      backgroundType,
      showDivider,
    };
  }

  return userOptions;
}

// 获取图表默认配置项  图表级别
function getChartConfig(
  chart: 'Wnumbercard' | 'Wgauge',
  item: IDataItem | IWgaugeProps,
  // itemWidth: number,
  // itemHeight: number,
  // fullSize: boolean = false,
) {
  if (chart === 'Wnumbercard') {
    // const chartWidth = Math.max(62, itemWidth / 3);
    const chart = (item as IDataItem)?.chart;
    return {
      ...(chart && !React.isValidElement(chart)
        ? {
            chart: {
              ...chart,
              // width: chart?.position === 'center' ? null : chartWidth,
            },
          }
        : {}),
      itemStyle: {
        height: '100%',
        // height: itemHeight,
        width: '100%',
        ...(item?.itemStyle ?? {}),
      },
    };
  }

  return {};
}
