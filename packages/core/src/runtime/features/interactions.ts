import type { InteractionModel, LegendModel, ThemeToken } from '../types';

export interface ZoomBusinessConfig {
  zoom?: boolean;
}

export interface LegendInteractionConfig {
  showStackSum?: boolean;
  rawData?: Array<Record<string, unknown>>;
}

export interface SliderBusinessConfig {
  slider?:
    | boolean
    | {
        start?: number;
        end?: number;
        showText?: boolean;
        labelFormatter?: (...args: unknown[]) => unknown;
        sampleRate?: number;
        type?: 'simple' | 'normal' | 'default';
        [key: string]: unknown;
      };
}

function getHiddenLegendValues(rawData?: Array<Record<string, unknown>>): unknown[] {
  if (!Array.isArray(rawData)) {
    return [];
  }

  return rawData
    .filter((item) => item.visible === false && item.name !== undefined)
    .map((item) => item.name);
}

/**
 * 将业务 zoom 配置规范化为旧版 rectZoom 语义。
 * 具体的 G2 5 转接由 renderer 注册 legacyRectZoom interaction 完成。
 */
function tokenString(token: ThemeToken | undefined, key: string, fallback: string): string {
  const value = token?.[key];
  return typeof value === 'string' ? value : fallback;
}

export function normalizeZoom(config: ZoomBusinessConfig, resetText?: unknown, token?: ThemeToken): InteractionModel | undefined {
  if (!config.zoom) {
    return undefined;
  }
  const primary = tokenString(token, 'widgets-color-primary', '#6250f9');
  const background = tokenString(token, 'widgets-color-background', '#ffffff');
  const gray = tokenString(token, 'widgets-color-gray', '#aaaaaa');
  return {
    name: 'legacyRectZoom',
    spec: {
      resetText,
      events: ['zoom:start', 'zoom:end', 'zoom:reset'],
      style: { fill: background, stroke: gray, lineWidth: 0.5, pointerEvents: 'none' },
      textStyle: { fill: primary },
      activeStyle: { fill: background, stroke: primary },
    },
  };
}

/**
 * 复现旧 rectLegend + legendFilter 的默认图例交互语义。
 * G2 5 内置 legendFilter 负责基础过滤；不可全取消、反选和初始 visible=false 作为 headless
 * model 暴露给 adapter/renderer，用于补偿 G2 v4 自定义 action 的差异。
 */
export function normalizeLegendInteractions(
  legend: LegendModel | undefined,
  config: LegendInteractionConfig = {},
): InteractionModel[] {
  if (!legend?.visible || legend.mode !== 'g2') {
    return [];
  }

  const interactions: InteractionModel[] = [];
  interactions.push({ name: 'legacyEllipsisText', spec: true });

  if (legend.hoverable !== false) {
    interactions.push({
      name: 'legacyLegendHighlight',
      spec: {
        resetOnClick: true,
      },
    });
  }

  if (legend.clickable !== false && !config.showStackSum) {
    interactions.push({
      name: 'legacyLegendFilter',
      spec: {
        allowAllCanceled: Boolean(legend.allowAllCanceled),
        mode: legend.useReverseChecked ? 'singleChecked' : undefined,
        keepLast: !legend.allowAllCanceled,
        hiddenValues: getHiddenLegendValues(config.rawData),
      },
    });
  }

  if (legend.onHover) {
    interactions.push({ name: 'legendItemMouseenter', spec: { handler: legend.onHover } });
  }
  if (legend.onClick) {
    interactions.push({ name: 'legendItemClick', spec: { handler: legend.onClick } });
  }

  return interactions;
}

export interface SliderNormalizeOptions {
  token?: ThemeToken;
  data?: Array<Record<string, unknown>>;
  width?: number;
}

function sampleSliderData(data: Array<Record<string, unknown>> | undefined, rate: number): Array<Record<string, unknown>> | undefined {
  if (!Array.isArray(data) || data.length <= 2 || rate >= 1) {
    return data;
  }

  const step = Math.max(1, Math.ceil(1 / Math.max(rate, 0.001)));
  const sampled = data.filter((_, index) => index === 0 || index === data.length - 1 || index % step === 0);
  return sampled.length >= 2 ? sampled : [data[0], data[data.length - 1]];
}

function getSliderStyle(sliderConfig: Record<string, unknown>, token?: ThemeToken, data?: Array<Record<string, unknown>>) {
  const trendCfg = (typeof sliderConfig.trendCfg === 'object' && sliderConfig.trendCfg) as Record<string, unknown> | undefined;
  const backgroundStyle = (typeof sliderConfig.backgroundStyle === 'object' && sliderConfig.backgroundStyle) as Record<string, unknown> | undefined;
  const handlerStyle = (typeof sliderConfig.handlerStyle === 'object' && sliderConfig.handlerStyle) as Record<string, unknown> | undefined;
  const textStyle = (typeof sliderConfig.textStyle === 'object' && sliderConfig.textStyle) as Record<string, unknown> | undefined;
  const trendColor = tokenString(token, 'widgets-slider-trend-bg', '#4c4f53');
  const trendBorder = tokenString(token, 'widgets-slider-trend-border-color', '#808080');
  const handlerBorder = tokenString(token, 'widgets-slider-handler-border-color', '#414448');
  const background = tokenString(token, 'widgets-color-background', '#ffffff');
  const trendOpacity = Number(token?.['widgets-slider-trend-opacity'] ?? 0.1);

  return {
    track: { fill: background, stroke: trendBorder, fillOpacity: trendOpacity, ...backgroundStyle },
    handle: { fill: background, stroke: handlerBorder, ...handlerStyle },
    handleLabel: { ...textStyle },
    sparkline: {
      data: trendCfg?.data ?? data,
      smooth: trendCfg?.smooth ?? false,
      isArea: trendCfg?.isArea ?? true,
      line: { stroke: trendColor, opacity: trendOpacity, ...((trendCfg?.lineStyle as Record<string, unknown> | undefined) || {}) },
      area: { fill: trendColor, fillOpacity: trendOpacity, ...((trendCfg?.areaStyle as Record<string, unknown> | undefined) || {}) },
    },
  };
}

/**
 * 将业务 slider 配置规范化为 G2 5 spec 的 slider 对象。
 * 复现旧 rectSlider 的缩略轴语义（start/end/showText/labelFormatter/sampleRate/type）。
 */
export function normalizeSlider(config: SliderBusinessConfig, options: SliderNormalizeOptions = {}): Record<string, unknown> | false {
  if (!config.slider) {
    return false;
  }

  const sliderConfig = typeof config.slider === 'object' ? config.slider : {};
  const {
    labelFormatter,
    showText = false,
    sampleRate = 1,
    type = 'simple',
    start,
    end,
    trendCfg,
    backgroundStyle,
    handlerStyle,
    textStyle,
    ...restSliderConfig
  } = sliderConfig;
  const autoSampleRate = options.width && options.data?.length && options.data.length > options.width
    ? options.width / options.data.length
    : 1;
  const effectiveSampleRate = Math.min(Number(sampleRate) || 1, autoSampleRate);
  const sampledData = sampleSliderData(options.data, effectiveSampleRate);
  const style = getSliderStyle(
    { ...sliderConfig, trendCfg, backgroundStyle, handlerStyle, textStyle },
    options.token,
    sampledData,
  );

  return {
    x: {
      start: start ?? 0.64,
      end: end ?? 1,
      labelFormatter,
      showText,
      sampleRate: effectiveSampleRate,
      type,
      style,
      ...restSliderConfig,
    },
  };
}

export interface ScrollbarBusinessConfig {
  scrollbar?:
    | boolean
    | {
        type?: 'horizontal' | 'vertical';
        categorySize?: number;
        ratio?: number;
        value?: number;
        [key: string]: unknown;
      };
}

/**
 * 旧 src/common/rectScrollbar.ts：truthy 时调 chart.option('scrollbar', ...)。
 * G2 v5 通过 spec.scrollbar 原生支持；类型默认 horizontal（柱状/折线常见 X 滚动）。
 * 调用方（barModel/lineModel）若发现 column=false 横向条形图可在外部覆盖 type:'vertical'。
 */
export function normalizeScrollbar(config: ScrollbarBusinessConfig): Record<string, unknown> | false {
  if (!config.scrollbar) {
    return false;
  }
  const userConfig = typeof config.scrollbar === 'object' ? config.scrollbar : {};
  return {
    type: userConfig.type ?? 'horizontal',
    categorySize: userConfig.categorySize ?? 32,
    ...userConfig,
  };
}

