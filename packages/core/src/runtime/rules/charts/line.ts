import {
  BigDataJudgement,
  DataStructure,
  EmptyDataProcess,
  type ChartRuleDefinition,
  type RuleConfigObject,
  type RuleData,
} from '../types';
import { processLineBigData } from '../bigData';
import { processLineExtremeData } from '../extreme';
import { runDataRules } from '../dataRules';

const LINE_CLASSIFY_MAP: Record<string, string> = {
  '00000': 'line_chart',
  '10000': 'step_line_chart',
  '01000': 'smooth_line_chart',
  '00100': 'area_chart',
  '01100': 'smooth_area_chart',
  '00110': 'stacked_area_chart',
  '01110': 'smooth_stacked_area_chart',
  '00101': 'area_line_chart',
};

function classifyLine(data: RuleData, config: RuleConfigObject): string {
  const isStep = !!config?.step;
  const isSpline = !!config?.spline;
  const isArea = !!config?.area;
  const isStack = !!config?.stack;
  const isInterval = Array.isArray(data) && data.some((item) => Array.isArray(item.y));

  const code = `${isStep ? 1 : 0}${isSpline ? 1 : 0}${isArea ? 1 : 0}${isStack ? 1 : 0}${isInterval ? 1 : 0}`;
  return LINE_CLASSIFY_MAP[code] ?? 'line_chart';
}

function appendPaddingForLine(config: RuleConfigObject): RuleConfigObject {
  let finalConfig: RuleConfigObject = config;

  if (finalConfig.stack) {
    finalConfig = { ...finalConfig, area: true };
  }

  let appendPadding: number[] | null = null;
  const label = finalConfig.label as { visible?: boolean } | undefined;
  if (label && label.visible !== false) {
    appendPadding = [20, 20, 0, 0];
  } else if (finalConfig.symbol) {
    appendPadding = [10, 10, 0, 0];
  }

  const yAxis = finalConfig.yAxis as Record<string, unknown> | unknown[] | false | undefined;
  const yAxisHidden = Array.isArray(yAxis)
    ? yAxis[0] === false || (yAxis[0] as { visible?: boolean })?.visible === false
    : yAxis === false || (yAxis as { visible?: boolean })?.visible === false;

  if (appendPadding && yAxisHidden) {
    appendPadding[3] = appendPadding[0];
  }

  if (appendPadding) {
    finalConfig = {
      ...finalConfig,
      appendPadding: finalConfig.appendPadding || appendPadding,
    };
  }

  return finalConfig;
}

function applyGuideMax(config: RuleConfigObject): RuleConfigObject {
  const yAxis = config.yAxis as Record<string, unknown> | unknown[] | undefined;
  const guide = config.guide as Record<string, unknown> | undefined;
  if (!yAxis || !guide || Array.isArray(yAxis)) {
    return config;
  }

  let guideYMax: number | null = null;
  Object.keys(guide).forEach((key) => {
    const guideItem = guide[key];
    const items = Array.isArray(guideItem) ? guideItem : [guideItem];
    items.forEach((subItem) => {
      const entry = subItem as { axis?: string; value?: number } | undefined;
      if (entry?.axis === 'y' && (entry.value || entry.value === 0)) {
        if (guideYMax === null || (entry.value as number) > guideYMax) {
          guideYMax = entry.value as number;
        }
      }
    });
  });

  if (guideYMax !== null) {
    const currentMax = (yAxis as Record<string, unknown>).max as number | undefined;
    return {
      ...config,
      yAxis: { ...(yAxis as Record<string, unknown>), max: Math.max(currentMax ?? Number.NEGATIVE_INFINITY, guideYMax) },
    };
  }

  return config;
}

export const lineRule: ChartRuleDefinition = {
  id: 'line_chart',
  name: '线图',
  mainAxis: 'x',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Axis,
  classify: classifyLine,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 4,
        message: '该线图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度。',
      },
    ],
    process: processLineBigData,
  },
  extremeData: processLineExtremeData,
  children: {
    step_line_chart: { id: 'step_line_chart', name: '阶梯线图' },
    smooth_line_chart: { id: 'smooth_line_chart', name: '平滑线图' },
    area_chart: { id: 'area_chart', name: '面积图' },
    smooth_area_chart: { id: 'smooth_area_chart', name: '平滑面积图' },
    stacked_area_chart: { id: 'stacked_area_chart', name: '堆叠面积图' },
    smooth_stacked_area_chart: { id: 'smooth_stacked_area_chart', name: '平滑堆叠面积图' },
    area_line_chart: { id: 'area_line_chart', name: '区域线图' },
  },
  processConfig: (config) => applyGuideMax(appendPaddingForLine(config)),
  processData: (data, config) => runDataRules(data, config),
};
