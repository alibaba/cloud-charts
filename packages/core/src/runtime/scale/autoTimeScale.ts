import type { ChartLanguage, LocaleConfig } from '../types';
import { getAutoTimeMask, getText } from '../i18n';
import { timePretty, timeCat, type ScaleTickConfig } from './tickMethod';

function limitTicksToRange(ticks: unknown[], min?: number, max?: number): unknown[] {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return ticks;
  }
  return ticks.filter((tick) => {
    const tickValue = Number(tick);
    return tickValue >= min && tickValue <= max;
  });
}

export interface ScaleOption {
  type?: string;
  mask?: string;
  tickCount?: number;
  tickInterval?: number;
  tickMethod?: (cfg: ScaleTickConfig) => unknown[];
  showLast?: boolean;
  [key: string]: unknown;
}

export interface ScaleDataSeries {
  data?: Array<[unknown, unknown]>;
}

export interface AutoTimeScaleOptions {
  language?: ChartLanguage;
  locale?: LocaleConfig;
}

function findIndexIn2DArray(needle: string, haystack: string[][]): [number, number] | null {
  for (let row = 0; row < haystack.length; row += 1) {
    for (let col = 0; col < haystack[row].length; col += 1) {
      if (haystack[row][col] === needle) {
        return [row, col];
      }
    }
  }
  return null;
}

/**
 * 自动计算时间轴格式与 ticks，复现旧 common/autoTimeScale.ts，去 this/React 化。
 * - mask='auto'：依据数据跨度/间距自动选择 i18n mask。
 * - 自定义 mask：按当前语言映射对应 mask。
 * - 覆盖 tickMethod：保证时间轴能获取全量刻度（默认 tickCount 取数据量）。
 * - 分类轴默认 showLast。
 * 直接修改传入的 defs.x（与旧实现保持一致）。
 */
export function applyAutoTimeScale(
  defs: Record<string, ScaleOption>,
  data: ScaleDataSeries[],
  options: AutoTimeScaleOptions = {},
): void {
  const def = defs.x;
  if (!def) {
    return;
  }

  const { language, locale } = options;
  const isTimeScale = def.type === 'time' || def.type === 'timeCat';
  const hasSeriesData = Array.isArray(data) && data[0] && Array.isArray(data[0].data);

  if (isTimeScale && hasSeriesData) {
    if (def.mask === 'auto') {
      def.mask = getAutoTimeMask(data[0].data as Array<[unknown, unknown]>, {
        language,
        locale,
        tickInterval: def.tickInterval,
      });
    } else if (typeof def.mask === 'string') {
      const sourceMaskMap = getText('timeMask', { language: 'zh-cn', force: true }) as string[][] | undefined;
      const currentMaskMap = getText('timeMask', { language, locale }) as string[][] | undefined;
      const customMask = def.mask;
      const customMaskIndex = sourceMaskMap ? findIndexIn2DArray(customMask, sourceMaskMap) : null;
      def.mask =
        customMaskIndex && currentMaskMap
          ? currentMaskMap[customMaskIndex[0]][customMaskIndex[1]] || customMask
          : customMask;
    }

    if (!def.tickMethod && def.type === 'time') {
      def.tickMethod = (startOrConfig: ScaleTickConfig | number, end?: number, tickCount?: number) => {
        const tickConfig = typeof startOrConfig === 'object'
          ? startOrConfig
          : { min: startOrConfig, max: end, tickCount };
        return limitTicksToRange(
          timePretty({
            ...tickConfig,
            ...def,
            tickCount: def.tickCount || tickConfig.values?.length || tickConfig.tickCount || 7,
          }),
          tickConfig.min,
          tickConfig.max,
        );
      };
    } else if (!def.tickMethod && def.type === 'timeCat') {
      def.tickMethod = (startOrConfig: ScaleTickConfig | number, end?: number, tickCount?: number) => {
        const tickConfig = typeof startOrConfig === 'object'
          ? startOrConfig
          : { min: startOrConfig, max: end, tickCount };
        return limitTicksToRange(
          timeCat({
            ...tickConfig,
            ...def,
            tickCount: def.tickCount || tickConfig.values?.length || tickConfig.tickCount || 7,
          }),
          tickConfig.min,
          tickConfig.max,
        );
      };
    }
  } else if (def.type === 'cat' || def.type === 'timeCat') {
    def.showLast = true;
  }
}
