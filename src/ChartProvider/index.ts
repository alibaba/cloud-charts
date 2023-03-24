import React from 'react';
import LanguageMap, { LocaleItem } from '../locales';

export interface ChartContextProps {
  language: 'zh-cn' | 'en-us';
  locale?: LocaleItem;
}

export const ChartContext = React.createContext<ChartContextProps>({
  language: 'zh-cn',
});

const ChartProvider = ChartContext.Provider;

export default ChartProvider;

export const getText = (value: keyof LocaleItem, language: keyof typeof LanguageMap, locale: LocaleItem = null) => {
  return locale?.[value] || LanguageMap?.[language]?.[value];
};
