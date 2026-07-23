import type { ChartModel, ChartRuntimeContext, InteractionModel } from '../runtime/types';
import type { ChartSpec } from '../types/spec';
import { getLineDefaultConfig, type LineChartConfig } from './lineDefaultConfig';
import { applyAutoTimeScale, type ScaleOption } from '../runtime/scale';
import { getText } from '../runtime/i18n';
import { normalizeAxis, normalizeYAxis } from '../runtime/axis';
import { getAreaColorRange, resolveColorRange, toStringValue } from '../runtime/common';
import {
  normalizeLegend,
  normalizeTooltip,
  normalizeZoom,
  normalizeLegendInteractions,
  normalizeSlider,
  normalizeScrollbar,
  buildLineMarks,
  buildGuideMarks,
  type LineMarkConfig,
} from '../runtime/features';
import type { LineSeries, NormalizedLineRecord } from './line';
import { normalizeLineData } from './line';
import { composeChartModel, runRuntimePipeline } from './createChartModel';

const CHART_NAME = 'G2Line';

export interface CreateLineModelInput {
  data: LineSeries[];
  config?: LineChartConfig;
  context?: ChartRuntimeContext;
}

function toScaleSeries(seriesList: LineSeries[]): Array<{ data: Array<[unknown, unknown]> }> {
  return seriesList.map((series) => ({ data: series.data }));
}

const scaleAxisIgnoredKeys = new Set([
  'alias',
  'autoEllipsis',
  'autoHide',
  'autoRotate',
  'breaks',
  'customConfig',
  'grid',
  'label',
  'labelFormatter',
  'line',
  'rotate',
  'tick',
  'tickLine',
  'visible',
]);

function getScaleAxisConfig(axis: unknown): Record<string, unknown> {
  if (!axis || typeof axis !== 'object') {
    return {};
  }

  const scaleConfig: Record<string, unknown> = {};
  Object.entries(axis as Record<string, unknown>).forEach(([key, value]) => {
    if (!scaleAxisIgnoredKeys.has(key)) {
      scaleConfig[key] = value;
    }
  });
  return scaleConfig;
}

function buildScale(config: LineChartConfig, seriesList: LineSeries[], context: ChartRuntimeContext): Record<string, unknown> {
  const xAxisConfig = (config.xAxis ? config.xAxis : {}) as ScaleOption;
  const defs: Record<string, ScaleOption> = {
    x: { type: 'time', range: [0, 1], ...xAxisConfig },
  };

  applyAutoTimeScale(defs, toScaleSeries(seriesList), {
    language: context.language,
    locale: context.locale,
  });

  const scale: Record<string, unknown> = { x: defs.x };
  if (Array.isArray(config.yAxis)) {
    config.yAxis.forEach((axisConfig, axisIndex) => {
      scale[`y${axisIndex}`] = {
        type: 'linear',
        nice: true,
        independent: axisIndex > 0,
        ...getScaleAxisConfig(axisConfig),
      };
    });
  } else if (config.yAxis !== false) {
    scale.y = { type: 'linear', nice: true, ...getScaleAxisConfig(config.yAxis) };
  }
  return scale;
}

function getYAxisData(data: NormalizedLineRecord[], yField: string): NormalizedLineRecord[] {
  if (yField === 'y') {
    return data;
  }

  const axisIndex = Number(yField.replace('y', ''));
  return data.filter((datum) => datum.yAxis === axisIndex && datum.y !== undefined && datum.y !== null);
}

function getAreaFillOpacity(tokenValue: unknown): number {
  if (typeof tokenValue === 'number') {
    return tokenValue;
  }
  if (typeof tokenValue === 'string') {
    const opacity = Number(tokenValue);
    return Number.isNaN(opacity) ? 0.1 : opacity;
  }
  return 0.1;
}

/**
 * 折线图运行时模型组装：通用 pipeline + 折线特有 spec 装配。
 * 通用部分（mergeDefaultConfig → normalizeData → runRules → applyRuleProcessors → resolveTheme）见 createChartModel.ts。
 */
export function createLineModel(input: CreateLineModelInput): ChartModel {
  const pipeline = runRuntimePipeline<LineSeries[], LineChartConfig>({
    chartName: CHART_NAME,
    data: input.data,
    config: input.config,
    context: input.context,
    getDefaultConfig: getLineDefaultConfig,
    normalizeData: (data) => normalizeLineData(data) as unknown as Array<Record<string, never>>,
  });

  const { context, finalConfig, theme } = pipeline;
  const finalData = pipeline.finalData as unknown as NormalizedLineRecord[];
  const scale = buildScale(finalConfig, input.data, context);

  const legendValueMap: Record<string, unknown> = {};
  (input.data || []).forEach((series) => {
    const arr = series?.data;
    if (Array.isArray(arr) && arr.length > 0) {
      const last = arr[arr.length - 1];
      legendValueMap[series.name] = Array.isArray(last) ? last[1] : undefined;
    }
  });
  const isAreaChart = Boolean(finalConfig.area) || Boolean(finalConfig.stack);
  const legendModel = normalizeLegend(finalConfig.legend, theme.token, {
    marker: isAreaChart ? 'square' : 'hyphen',
    valueMap: legendValueMap,
  });
  const primaryYAxisConfig = Array.isArray(finalConfig.yAxis) ? finalConfig.yAxis[0] : finalConfig.yAxis;
  const tooltipModel = normalizeTooltip(
    typeof finalConfig.tooltip === 'object'
      ? {
          ...(typeof primaryYAxisConfig === 'object' ? primaryYAxisConfig : {}),
          ...finalConfig.tooltip,
          yAxisFormatConfig: typeof primaryYAxisConfig === 'object' ? primaryYAxisConfig : undefined,
          dualYAxisFormatConfigs: Array.isArray(finalConfig.yAxis) ? finalConfig.yAxis : undefined,
          xAxisType: (scale.x as ScaleOption)?.type,
          xAxisMask: (scale.x as ScaleOption)?.mask,
          themeToken: theme.token,
        }
      : finalConfig.tooltip,
  );

  const xAxisType = (scale.x as ScaleOption)?.type as string | undefined;
  const xAxisSpec = normalizeAxis(
    finalConfig.xAxis === false ? false : { ...(scale.x as Record<string, unknown>), type: xAxisType },
    { grid: finalConfig.grid, field: 'x', token: theme.token },
  );
  const yAxisSpec = normalizeYAxis(finalConfig.yAxis, {
    grid: finalConfig.grid,
    defaultGrid: true,
    token: theme.token,
  });

  const colorRange = resolveColorRange(finalConfig.colors, theme.token);
  const areaColorRange = getAreaColorRange(
    colorRange,
    Array.isArray(finalConfig.areaColors) ? resolveColorRange(finalConfig.areaColors, theme.token) : undefined,
    Boolean(finalConfig.stack),
  );
  const areaFillOpacity = getAreaFillOpacity(theme.token['widgets-shape-area-opacity']);
  const symbolFillColor = toStringValue(theme.token['widgets-container-background'], '#ffffff');
  const symbolLineWidth = 1.5;
  const guideMarks = buildGuideMarks(finalConfig.guide, { themeToken: theme.token, scales: scale });

  const zoomInteraction = normalizeZoom(
    finalConfig,
    getText('reset', { language: context.language, locale: context.locale }),
    theme.token,
  );
  const legendInteractions = normalizeLegendInteractions(legendModel, {
    showStackSum: Boolean(finalConfig.showStackSum),
    rawData: input.data as unknown as Array<Record<string, unknown>>,
  });
  const sliderSpec = normalizeSlider(finalConfig, { token: theme.token, data: finalData, width: context.size?.[0] });
  const scrollbarSpec = normalizeScrollbar(finalConfig);
  const interactions = [zoomInteraction, ...legendInteractions].filter(Boolean) as InteractionModel[];

  const yAxisEntries: Array<{
    yField: 'y' | 'y0' | 'y1';
    axis: false | Record<string, unknown> | undefined;
    scale: Record<string, unknown> | undefined;
  }> = Array.isArray(finalConfig.yAxis)
    ? finalConfig.yAxis.map((_, axisIndex) => {
        const yField = `y${axisIndex}` as 'y0' | 'y1';
        return {
          yField,
          axis: axisIndex === 0 ? yAxisSpec.y : yAxisSpec.y1,
          scale: (scale[yField] || { type: 'linear', nice: true }) as Record<string, unknown>,
        };
      })
    : [{ yField: 'y', axis: yAxisSpec.y, scale: scale.y as Record<string, unknown> | undefined }];

  const childrenSpecs: ChartSpec[] = [];
  yAxisEntries.forEach(({ yField, axis, scale: yScale }) => {
    const marks = buildLineMarks({ ...(finalConfig as LineMarkConfig), areaFillOpacity, symbolFillColor, symbolLineWidth }, 'y');
    const markData = getYAxisData(finalData, yField);

    marks.forEach((mark) => {
      const markColorRange = mark.type === 'area' ? areaColorRange : colorRange;
      const colorScale = markColorRange
        ? {
            color: {
              range: markColorRange,
              ...(mark.type === 'area' ? { independent: true } : {}),
            },
          }
        : {};
      childrenSpecs.push({
        type: mark.type,
        data: markData,
        encode: mark.encode,
        transform: mark.transform,
        scale: {
          y: yScale,
          ...colorScale,
        },
        axis: { y: mark.type === 'line' ? axis : false },
        style: mark.style,
        tooltip: mark.tooltip === false ? false : tooltipModel.markSpec,
      } as ChartSpec);
    });
  });
  guideMarks.forEach((mark) => {
    const yField = mark.yField || 'y';
    const guideAxis = yField === 'y1' ? yAxisSpec.y1 : yAxisSpec.y;
    const guideScale = yField === 'y1' ? scale.y1 : yField === 'y0' ? scale.y0 : scale.y;
    childrenSpecs.push({
      type: mark.type,
      data: mark.data,
      encode: mark.encode,
      scale: mark.scale || (guideScale ? { y: guideScale } : undefined),
      axis: mark.axis || { y: guideAxis },
      style: mark.style,
      labels: mark.labels,
    });
  });

  const axisSpec: Record<string, unknown> = {
    x: xAxisSpec,
    ...(Array.isArray(finalConfig.yAxis) ? {} : { y: yAxisSpec.y }),
  };

  const spec: ChartSpec = {
    type: 'view',
    data: finalData,
    scale,
    axis: axisSpec,
    legend: legendModel.spec === false ? false : { color: legendModel.spec },
    tooltip: tooltipModel.spec,
    theme: theme.g2Theme,
    children: childrenSpecs,
  };

  if (colorRange) {
    spec.scale = { ...(spec.scale as Record<string, unknown>), color: { range: colorRange } };
  }
  if (sliderSpec) {
    spec.slider = sliderSpec;
  }
  if (scrollbarSpec) {
    spec.scrollbar = scrollbarSpec;
  }

  return composeChartModel({
    chartName: CHART_NAME,
    spec,
    pipeline,
    legend: legendModel,
    tooltip: tooltipModel,
    interactions,
  });
}
