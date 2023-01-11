import EmptyDataType, { EmptyJudgeType } from './emptyDataType';
import { ExceedJudgeType } from './bigDataType';
import themes from '../themes';
import { warn } from './log';

// 空数据检测
export function checkEmptyData(data: any, chartType: string) {
  const type = (EmptyDataType as any)[chartType]?.emptyJudge;
  if (type === EmptyJudgeType.COMMON) {
    return (
      !data ||
      (Array.isArray(data) && data?.length === 0) ||
      (Array.isArray(data) && data?.every((item: any) => !item?.data || item?.data?.length === 0)) ||
      Object.keys(data)?.length === 0
    );
  }
  if (type === EmptyJudgeType.CHILDREN) {
    return !data || !data?.children || data?.children?.length === 0;
  }
  if (type === EmptyJudgeType.ARRAY) {
    return !data || data?.length === 0;
  }
  if (type === EmptyJudgeType.GRAPH) {
    return !data || !data?.nodes || data?.nodes?.length === 0 || !data?.links || data?.links?.length === 0;
  }

  return false;
}

// 大数据检测
export function checkBigData(
  chartName: string,
  config: any,
  judgements: any,
  dataSize: number,
  width: number,
  height: number,
) {
  if (!dataSize || dataSize === 0 || !width || !height) {
    return false;
  }

  let res = false;
  judgements?.forEach((judgement: any) => {
    const { type, threshold, message } = judgement;
    let isExceed = false;
    if (type === ExceedJudgeType.LEGNTH) {
      const isHorizontal =
        judgement?.directionConfig === 'column'
          ? config?.column !== undefined && (!config?.column || typeof config?.column === 'object')
          : judgement?.directionConfig === 'direction'
          ? config?.direction !== 'horizontal'
          : false;
      const length = isHorizontal ? height ?? 0 : width ?? 0;
      isExceed = length > 0 && length / dataSize < threshold;
    } else if (type === ExceedJudgeType.AREA) {
      isExceed = (height * width) / dataSize < threshold;
    } else if (type === ExceedJudgeType.NUMBER) {
      isExceed = dataSize > threshold;
    }
    /*
    else if (type === ExceedJudgeType.POLAR) {
      const radius = Math.min(this.chart?.coordinateBBox?.height, this.chart?.coordinateBBox?.width);
      isExceed = radius < threshold;
    }
    */

    if (isExceed) {
      warn(chartName.slice(2, chartName.length), message);
      res = true;
    }
  });
  return res;
}

// 颜色检测
// 目标是检测config里面所有的颜色配置，这里暂时判断color/areaColors
export function checkColor(config: any, chartType: string, chart: any) {
  const filterColors: string[] = [];
  const themeString = JSON.stringify(themes);
  Object.keys(config).forEach((sub: string) =>{
    if (sub.toUpperCase().includes('COLOR') && Array.isArray(config[sub])) {
      config[sub].forEach((color: string) =>{
        if (!themeString.toUpperCase().includes(color.toUpperCase())) {
          filterColors.push(color);
        }
      })
    }
  });
  if(filterColors.length > 0) {
    warn('Colors', `检测出不符合主题色彩的色值：${filterColors.join(',')}，建议删除`);
  }
}

// 间距检测
// 目标是检测config里面所有自定义的间距配置
export function checkPadding(config: any) {
  if(config.hasOwnProperty('padding') && config.padding) {
    const checkPaddingValue = config.padding === 0 || config.padding === 'auto';
    if (!checkPaddingValue) {
      warn('Padding', `检测出额外配置了图表间距padding: [${config.padding}]，需要删除。如特殊需求，请使用appendPadding配置`);
    }
  }
}