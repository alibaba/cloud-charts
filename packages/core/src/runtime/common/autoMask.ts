import type { ChartLanguage, LocaleConfig } from '../types';
import { getAutoTimeMask } from '../i18n';

export interface AutoMaskScaleOption {
  tickInterval?: number;
  [key: string]: unknown;
}

export function getAutoMask(
  scaleOption: AutoMaskScaleOption,
  data: Array<[unknown, unknown]>,
  language?: ChartLanguage,
  locale?: LocaleConfig,
): string {
  return getAutoTimeMask(data, {
    language,
    locale,
    tickInterval: scaleOption.tickInterval,
  });
}
