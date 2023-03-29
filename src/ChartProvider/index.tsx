import React, { Component } from 'react';
import LanguageMap, { LocaleItem } from '../locales';
import { Language } from '../common/types';
import eventBus from '../common/eventBus';

export interface ChartProviderProps {
  language?: Language;
  locale?: LocaleItem;
}

export const ChartContext = React.createContext<ChartProviderProps>({
  language: 'zh-cn',
});

let currentLanguage: Language;

export function setLanguage(language: Language) {
  currentLanguage = language;
  eventBus.emit('setLanguage');
}

class ChartProvider extends Component<ChartProviderProps> {
  private language: Language;

  private locale: LocaleItem;

  constructor(props: ChartProviderProps) {
    super(props);
    this.language = props.language || 'zh-cn';
    this.locale = props.locale;
  }

  render() {
    return (
      <ChartContext.Provider
        value={{
          language: this.language,
          locale: this.locale,
        }}
      >
        {this.props.children}
      </ChartContext.Provider>
    );
  }
}

export default ChartProvider;

// 优先级: setLanguage设置的语言 > 图表中的自定义locale > provider的locale > 图表中的language > provider的language
export const getText = (value: keyof LocaleItem, language: keyof typeof LanguageMap, locale: LocaleItem = null) => {
  return currentLanguage
    ? LanguageMap?.[currentLanguage]?.[value]
    : locale?.[value] || LanguageMap?.[language]?.[value];
};
