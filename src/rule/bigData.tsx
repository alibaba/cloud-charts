import React from 'react';
import { warn } from '../common/log';
import { numberDecimal } from '../common/common';
import { Types } from '../common/types';
import themes from '../themes';
import { cloneDeep } from 'lodash';
import { FullCrossName } from '../constants';

/** 大数据判断条件 */
export enum BigDataJudgement {
  // 笛卡尔坐标系中，两个坐标轴刻度之间的长度
  Length,
  // 笛卡尔坐标系中，每个数据的平均占有面积
  Area,
  // 极坐标系中，图表的半径
  Polar,
  // 数据量大小
  Number,
}

/** 大数据处理 */
export interface IBigData {
  /** 判断条件 */
  type: BigDataJudgement;

  /** 阈值 */
  threshold: number;

  /** 判断时机：初始化or绘制前 */
  period?: 'init' | 'before_paint';

  /** 提示信息 */
  message?: string;
}

/** 判断是否是大数据（初始化） */
export function isBigDataInit(
  chartName: string,
  judgements: IBigData[],
  dataSize: number,
  width: number,
  height: number,
  mainAxis = 'x',
) {
  if (!dataSize || !width || !height) {
    return false;
  }

  let res = false;
  judgements?.forEach((judgement: IBigData) => {
    const { type, threshold, period = 'init', message } = judgement;
    if (period === 'init') {
      let isBigData = false;

      if (type === BigDataJudgement.Length) {
        const length = mainAxis === 'x' ? width ?? 0 : height ?? 0;
        isBigData = length > 0 && length / dataSize < threshold;
      } else if (type === BigDataJudgement.Area) {
        isBigData = (height * width) / dataSize < threshold;
      } else if (type === BigDataJudgement.Number) {
        isBigData = dataSize > threshold;
      } else if (type === BigDataJudgement.Polar) {
        const radius = Math.min(height, width);
        isBigData = radius < threshold;
      }
      res = res || isBigData;
      if (isBigData && message) {
        warn(chartName, message);
      }
    }
  });

  return res;
}

/** 判断是否是大数据(绘制前) */
export function isBigDataBeforePaint(
  chartName: string,
  judgements: IBigData[],
  chart: any,
  dataSize: number,
  mainAxis = 'x',
) {
  let res = false;
  judgements?.forEach((judgement: IBigData) => {
    const { type, threshold, period = 'init', message } = judgement;
    if (period === 'before_paint') {
      let isBigData = false;

      const { width = 0, height = 0 } = chart?.coordinateBBox || {};

      if (type === BigDataJudgement.Length) {
        const length = mainAxis === 'x' ? width : height;
        isBigData = length > 0 && length / dataSize < threshold;
      } else if (type === BigDataJudgement.Area) {
        isBigData = (height * width) / dataSize < threshold;
      } else if (type === BigDataJudgement.Number) {
        isBigData = dataSize > threshold;
      }
      if (type === BigDataJudgement.Polar) {
        const radius = Math.min(chart?.coordinateBBox?.height, chart?.coordinateBBox?.width);
        isBigData = radius < threshold;
      }
      res = res || isBigData;
      if (isBigData && message) {
        warn(chartName, message);
      }
    }
  });

  return res;
}

/** 柱图大数据处理方式：开启slider */
export function processBarBigData(chartObj: any, data: any) {
  const { dataSize } = chartObj;
  const { force } = chartObj.props;
  const chartName = chartObj?.chartRule?.name;
  return {
    config: {
      // 暂时不显示slider
      // slider: {
      //   start: 1 - Math.max(Number((30 / dataSize).toFixed(2)), 0.01),
      //   end: 1,
      // },
    },
  };
}

/** 线图大数据处理方式： */
export function processLineBigData(chartObj: any, data: any) {
  const { dataSize } = chartObj;
  const { force } = chartObj.props;
  const chartId = chartObj?.chartRule?.id;
  if (force === true) {
    return {};
  }

  let shouldArea = false;
  // 堆叠图对面积不做关闭
  if (chartId.includes('stack')) {
    shouldArea = true;
  }

  return {
    config: {
      symbol: false,
      spline: false,
      area: shouldArea,
      // 暂时不显示slider
      // slider: {
      //   start: 1 - Math.max(Number((100 / dataSize).toFixed(2)), 0.01),
      //   end: 1,
      // },
    },
  };
}

/** 饼图大数据处理方式：合并数据 */
export function processPieBigData(chartObj: any, data: any) {
  const { dataSize, props } = chartObj;
  // const { force } = chartObj.props;
  // const chartName = chartObj?.chartRule?.name;
  // if (force === true) {
  //   return {};
  // }

  if (props?.config?.autoFormat && dataSize > 5) {
    // 数据排序
    if (props?.config?.autoSort !== false) {
      data.sort((a: Types.LooseObject, b: Types.LooseObject) => b.y - a.y);
    }

    // 计算总数据
    const total = data.reduce((pre: number, cur: Types.LooseObject) => pre + cur.y, 0);

    // 数据逆序计算，需要动态计算出从第几个数据开始合并为其他
    let remainReverseIndex = 0;
    // 用于计算剩余数量总和，当总和占total的占比小于10%的时候，将当前数据索引保存，作为其他
    let tempRemainCount = 0;

    const tempData = cloneDeep(data);
    tempData?.reverse()?.forEach((a: Types.LooseObject, index: number) => {
      tempRemainCount += a.y;
      if (numberDecimal(tempRemainCount / total <= (props?.config?.autoFormat?.percent ?? 0.1))) {
        remainReverseIndex = index;
      }
    });

    if (remainReverseIndex !== data.length) {
      const remainIndex = data.length - (remainReverseIndex + 1);
      // 计算剩余占比
      const remainTotal = data
        .slice(remainIndex, data.length)
        .reduce((pre: number, cur: Types.LooseObject) => pre + cur.y, 0);

      const newData = [
        ...data.slice(0, remainIndex),
        {
          x: '其他',
          y: remainTotal,
          extra: data.slice(remainIndex, data.length),
        },
      ];

      return {
        data: newData,
        config: {
          autoSort: false,
          colors: themes.category_12.slice(0, remainIndex).concat(themes['widgets-axis-line']),
          tooltip: {
            reactContent: (title: string, data: any) => {
              const extraData = data?.[0]?.data?.extra ?? [];
              return (
                <>
                  <div className="g2-tooltip-title" />
                  <ul className="g2-tooltip-list">
                    {data.map((el: any) => {
                      return (
                        <li
                          className={`${FullCrossName}-tooltip-extra-list-item g2-tooltip-list-item`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            className="g2-tooltip-marker"
                            style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: el.color }}
                          ></div>
                          <div className="g2-tooltip-name">{el.name}</div>:
                          <div
                            className="g2-tooltip-value"
                            style={{
                              flex: 1,
                              textAlign: 'end',
                            }}
                          >
                            {el.value}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  {extraData?.length > 0 && (
                    <div className={`${FullCrossName}-tooltip-extra`}>
                      <div
                        className={`${FullCrossName}-tooltip-extra-divide`}
                        style={{
                          height: 1,
                          width: '100%',
                          backgroundColor: themes['widgets-axis-line'],
                          marginBottom: 12,
                        }}
                      />
                    </div>
                  )}
                  {extraData?.length > 0 && (
                    <ul className={`${FullCrossName}-tooltip-extra-list g2-tooltip-list`}>
                      {extraData.map((el: any, index: number) => {
                        return (
                          <li
                            className={`${FullCrossName}-tooltip-extra-list-item g2-tooltip-list-item`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <div
                              className={`${FullCrossName}-tooltip-extra-marker g2-tooltip-marker`}
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: themes.category_20[remainIndex + index],
                              }}
                            ></div>
                            <div className={`${FullCrossName}-tooltip-extra-name g2-tooltip-name`}>{el.x}</div>:
                            <div
                              className={`${FullCrossName}-tooltip-extra-value g2-tooltip-value`}
                              style={{
                                flex: 1,
                                textAlign: 'end',
                              }}
                            >
                              {el.y}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              );
            },
          },
        },
      };
    }
  }
  return {};
}
