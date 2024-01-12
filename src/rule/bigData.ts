import { warn } from '../common/log';
import { numberDecimal } from '../common/common';
import { Types } from '../common/types';
import themes from '../themes';

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
  return {
    config: {
      symbol: false,
      spline: false,
      area: false,
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

  if (props?.config?.autoFormat && dataSize > 5) {
    // 数据排序
    if (props?.config?.autoSort !== false) {
      data.sort((a: Types.LooseObject, b: Types.LooseObject) => b.y - a.y);
    }

    // 计算总数据
    const total = data.reduce((pre: number, cur: Types.LooseObject) => pre + cur.y, 0);

    // 计算剩余占比
    const remainTotal = data.slice(5, data.length).reduce((pre: number, cur: Types.LooseObject) => pre + cur.y, 0);

    // 若剩余内容小于10%，剩余内容改为其他
    if (numberDecimal(remainTotal / total, 2) <= 0.1) {
      const newData = [
        ...data.slice(0, 5),
        {
          x: '其他',
          y: remainTotal,
        },
      ];

      return {
        data: newData,
        config: {
          autoSort: false,
          colors: themes.category_12.slice(0, 5).concat(themes['widgets-axis-line']),
        },
      };
    }
  }
  return {};
}
