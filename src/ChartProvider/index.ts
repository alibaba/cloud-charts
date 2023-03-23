import React from 'react';
import LanguageMap, { LocaleItem } from '../locales';
import { Language } from '../common/types';

export interface ChartContextProps {
  language?: Language;
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
