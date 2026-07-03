import {
  BigDataJudgement,
  type BigDataJudgementConfig,
  type RuleProcessOutput,
  type RuleProcessParams,
} from './types';

/** 判断是否是大数据（初始化阶段），复现旧 rule/bigData.tsx 的 isBigDataInit。 */
export function isBigDataInit(
  judgements: BigDataJudgementConfig[] | undefined,
  dataSize: number,
  width: number,
  height: number,
  mainAxis: 'x' | 'y' = 'x',
): boolean {
  if (!dataSize || !width || !height) {
    return false;
  }

  let result = false;
  judgements?.forEach((judgement) => {
    const { type, threshold } = judgement;
    let isBigData = false;

    if (type === BigDataJudgement.Length) {
      const length = mainAxis === 'x' ? width : height;
      isBigData = length > 0 && length / dataSize < threshold;
    } else if (type === BigDataJudgement.Area) {
      isBigData = (height * width) / dataSize < threshold;
    } else if (type === BigDataJudgement.Number) {
      isBigData = dataSize > threshold;
    } else if (type === BigDataJudgement.Polar) {
      const radius = Math.min(height, width);
      isBigData = radius < threshold;
    }

    result = result || isBigData;
  });

  return result;
}

/** 线图大数据处理方式：关闭 symbol/spline，按需开启 slider，复现旧 processLineBigData。 */
export function processLineBigData(params: RuleProcessParams): RuleProcessOutput {
  const { dataSize, config, force, ruleId } = params;

  if (force === true || (typeof force === 'object' && force?.bigdata === true)) {
    return {};
  }

  const shouldArea = ruleId.includes('stack');

  const xAxis = config?.xAxis as { type?: string } | undefined;
  const needSlider = xAxis?.type === 'cat';

  const existingSlider = config?.slider;
  const computedSlider = needSlider
    ? {
        start: 1 - Math.max(Number((30 / dataSize).toFixed(2)), 0.01),
        end: 1,
      }
    : false;

  return {
    config: {
      symbol: false,
      spline: false,
      area: shouldArea,
      slider: existingSlider ? existingSlider : computedSlider,
    },
  };
}

/** 柱图大数据处理方式：自动开启 slider，复现旧 processBarBigData。 */
export function processBarBigData(params: RuleProcessParams): RuleProcessOutput {
  const { dataSize, config, force } = params;

  if (force === true || (typeof force === 'object' && force?.bigdata === true)) {
    return {};
  }

  const existingSlider = config?.slider;
  return {
    config: {
      slider: existingSlider
        ? existingSlider
        : {
            start: 1 - Math.max(Number((30 / dataSize).toFixed(2)), 0.01),
            end: 1,
          },
    },
  };
}

/** 饼图大数据处理方式：合并占比极小的项为「其他」，复现旧 processPieBigData。 */
export function processPieBigData(params: RuleProcessParams): RuleProcessOutput {
  const { data, config, dataSize } = params;
  const autoFormat = config?.autoFormat as boolean | { percent?: number } | undefined;

  if (!autoFormat || dataSize <= 5 || !Array.isArray(data)) {
    return {};
  }

  const percentThreshold = typeof autoFormat === 'object' ? (autoFormat.percent ?? 0.1) : 0.1;
  const sorted = config?.autoSort !== false ? [...data].sort((a, b) => Number(b.y ?? 0) - Number(a.y ?? 0)) : [...data];
  const total = sorted.reduce((sum, item) => sum + Number(item.y ?? 0), 0);
  if (total === 0) return {};

  let tempSum = 0;
  let splitIndex = sorted.length;
  for (let i = sorted.length - 1; i >= 0; i--) {
    tempSum += Number(sorted[i].y ?? 0);
    if (tempSum / total <= percentThreshold) {
      splitIndex = i;
    } else {
      break;
    }
  }

  if (splitIndex >= sorted.length) return {};

  const kept = sorted.slice(0, splitIndex);
  const merged = sorted.slice(splitIndex);
  const mergedTotal = merged.reduce((sum, item) => sum + Number(item.y ?? 0), 0);
  const newData = [
    ...kept,
    { x: '其他', y: mergedTotal, type: '其他', extra: merged },
  ];

  return {
    data: newData as unknown as RuleProcessOutput['data'],
    config: { autoSort: false },
  };
}
