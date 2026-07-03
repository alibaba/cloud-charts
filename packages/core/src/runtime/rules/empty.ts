import { DataStructure, EmptyDataProcess, type RuleConfigObject, type RuleData } from './types';

export interface EmptyProcessOutput {
  data: RuleData;
  config: RuleConfigObject | null;
}

/**
 * 根据空数据处理类型、数据结构类型产出占位数据与配置，复现旧 rule/emptyData.ts。
 * 仅返回数据/配置模型，不触碰 DOM 与背景色（背景色由渲染层依据 emptyType 决定）。
 */
export function processEmptyData(
  emptyType: EmptyDataProcess,
  dataType: DataStructure,
  chartName: string,
): EmptyProcessOutput {
  if (emptyType === EmptyDataProcess.Axis) {
    return {
      data: [],
      config: {
        xAxis: { min: 0, max: 100, label: false },
        yAxis: { min: 0, max: 100, label: false },
        padding: 0,
        guide: { visible: false },
        zoom: false,
      },
    };
  }

  if (emptyType === EmptyDataProcess.Polar) {
    if (chartName === 'G2Radar') {
      return {
        data: [
          { x: 'a', y: 0 },
          { x: 'b', y: 0 },
          { x: 'c', y: 0 },
          { x: 'd', y: 0 },
          { x: 'e', y: 0 },
          { x: 'f', y: 0 },
        ],
        config: {
          xAxis: { label: false },
          yAxis: { min: 0, max: 100, label: false },
          legend: false,
          tooltip: false,
          zoom: false,
          padding: 0,
        },
      };
    }
    if (dataType === DataStructure.Common) {
      return {
        data: [{ x: 'a', y: 100 }],
        config: { legend: false, tooltip: false, label: false, zoom: false, padding: 0 },
      };
    }
  }

  if (dataType === DataStructure.Common) {
    if (chartName === 'G2Rectangle') {
      return {
        data: [{ x: 0, y: 0 }],
        config: { padding: 0, xAxis: false, yAxis: false, tooltip: false, legend: false, zoom: false },
      };
    }
    return {
      data: [],
      config: { padding: 0, xAxis: false, yAxis: false, tooltip: false, legend: false, zoom: false },
    };
  }

  if (dataType === DataStructure.Graph) {
    return {
      data: [],
      config: { padding: 0, xAxis: false, yAxis: false, tooltip: false, legend: false, zoom: false },
    };
  }

  // Fallback：未识别的 emptyType + dataType + chartName 组合，仍要给安全占位
  // 避免下游 runRules / deepMerge 拿到 null 崩溃；语义与 DataStructure.Graph 分支一致：
  // 空数据 + 隐藏所有装饰（axis/tooltip/legend/zoom）。
  return {
    data: [],
    config: { padding: 0, xAxis: false, yAxis: false, tooltip: false, legend: false, zoom: false },
  };
}
