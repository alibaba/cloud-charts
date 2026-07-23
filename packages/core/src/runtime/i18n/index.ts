import type { ChartLanguage, LocaleConfig, LocaleTextMap } from '../types';
import { builtInLocales, DEFAULT_LANGUAGE } from './locales';
import { emit, on } from '../eventBus';

const LANGUAGE_CHANGE_EVENT = 'setLanguage';
let currentLanguage: ChartLanguage = DEFAULT_LANGUAGE;

/** 获取当前全局语言。 */
export function getLanguage(): ChartLanguage {
  return currentLanguage;
}

/** 全局设置语言。触发 eventBus 'setLanguage' 事件。 */
export function setLanguage(language: ChartLanguage): void {
  currentLanguage = language;
  emit(LANGUAGE_CHANGE_EVENT, language);
}

/** 订阅语言变化事件。返回取消订阅函数。 */
export function onLanguageChange(fn: (language: string) => void): () => void {
  return on(LANGUAGE_CHANGE_EVENT, fn as (...args: unknown[]) => void);
}

function isLanguageMap(locale: LocaleConfig): locale is Record<ChartLanguage, LocaleTextMap> {
  if (!locale || typeof locale !== 'object') {
    return false;
  }

  const values = Object.values(locale);
  return values.some((value) => value !== null && typeof value === 'object' && !Array.isArray(value));
}

function resolveLanguage(language: ChartLanguage | undefined): ChartLanguage {
  const targetLanguage = language || currentLanguage;
  if (targetLanguage && targetLanguage in builtInLocales) {
    return targetLanguage;
  }

  return DEFAULT_LANGUAGE;
}

function getBuiltInText(key: string, language: ChartLanguage): LocaleTextMap[string] {
  return builtInLocales[language]?.[key] ?? builtInLocales[DEFAULT_LANGUAGE]?.[key];
}

export interface GetTextOptions {
  language?: ChartLanguage;
  locale?: LocaleConfig;
  force?: boolean;
}

export function getText(key: string, options: GetTextOptions = {}): LocaleTextMap[string] {
  const { language, locale, force } = options;
  const resolvedLanguage = resolveLanguage(language);

  if (force) {
    return getBuiltInText(key, resolvedLanguage);
  }

  if (locale) {
    if (isLanguageMap(locale)) {
      const languageLocale = locale[resolvedLanguage];
      if (languageLocale && key in languageLocale) {
        return languageLocale[key];
      }
      const defaultLocale = locale[DEFAULT_LANGUAGE];
      if (defaultLocale && key in defaultLocale) {
        return defaultLocale[key];
      }
    } else if (key in locale) {
      return (locale as LocaleTextMap)[key];
    }
  }

  return getBuiltInText(key, resolvedLanguage);
}

const SECOND_MS = 1000;
const MINUTE_MS = 60 * 1000;
const HOUR_MS = 59 * 60 * 1000;
const DAY_MS = 22 * HOUR_MS;
const YEAR_MS = 365 * DAY_MS;

const timeSpanThresholds = [0.51 * YEAR_MS, 28 * DAY_MS, DAY_MS, HOUR_MS, MINUTE_MS, SECOND_MS];

function getTimeIndex(timeSpan: number): number {
  for (let index = 0; index < timeSpanThresholds.length; index += 1) {
    if (timeSpan >= timeSpanThresholds[index]) {
      return index;
    }
  }

  return timeSpanThresholds.length;
}

export interface AutoMaskOptions {
  language?: ChartLanguage;
  locale?: LocaleConfig;
  tickInterval?: number;
}

export function getAutoTimeMask(data: Array<[unknown, unknown]>, options: AutoMaskOptions = {}): string {
  const { language, locale, tickInterval } = options;
  const defaultMask = getText('defaultMask', { language, locale }) as string;

  if (!Array.isArray(data) || data.length < 2) {
    return defaultMask;
  }

  const sortedData = [...data].sort((left, right) => Number(left[0]) - Number(right[0]));

  const min = new Date(sortedData[0][0] as string).getTime();
  const minFirst = new Date(sortedData[1][0] as string).getTime();
  const max = new Date(sortedData[sortedData.length - 1][0] as string).getTime();

  if (Number.isNaN(min) || Number.isNaN(max) || Number.isNaN(minFirst)) {
    return defaultMask;
  }

  const span = max - min;
  const interval = tickInterval ?? minFirst - min;

  const spanIndex = getTimeIndex(span);
  const intervalIndex = getTimeIndex(interval);

  const maskMap = getText('timeMask', { language, locale }) as string[][] | undefined;
  const maskRow = maskMap?.[intervalIndex];

  return maskRow?.[spanIndex] ?? defaultMask;
}

export { builtInLocales, DEFAULT_LANGUAGE } from './locales';
