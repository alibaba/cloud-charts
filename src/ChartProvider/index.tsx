import React, { Component } from 'react';
import LanguageMap, { LocaleItem } from '../locales';
import { BaseChartConfig, Language, Rule } from '../common/types';
import { Theme } from '../themes/themeTools';
import eventBus from '../common/eventBus';
import { FullLanguageName, FullLanguageEventName } from '../constants';
export interface ChartProviderProps {
  language?: Language;
  locale?: LocaleItem | Record<string, LocaleItem>;
  defaultConfig?: BaseChartConfig;
  theme?: string | Theme;
  rule?: Rule;
}

export const ChartContext = React.createContext<ChartProviderProps>({
  language: 'zh-cn',
});

let currentLanguage: Language;

// 函数
export function setLanguage(language: Language) {
  currentLanguage = language;
  eventBus.emit('setLanguage', { language });
}

// 获取当前语言，仅用于通过setLanguage、事件与全局变量方式设置的语言，不支持图表组件内部设置的语言
export function getLanguage() {
  return currentLanguage;
}

// 全局变量
if (window[FullLanguageName]) {
  setLanguage(window[FullLanguageName]);
}

// 事件
document.addEventListener(FullLanguageEventName, function (e: CustomEvent) {
  if (e.detail) {
    setLanguage(e.detail);
  }
});

class ChartProvider extends Component<ChartProviderProps> {
  private language: Language;

  private locale: LocaleItem | Record<string, LocaleItem>;

  private defaultConfig: BaseChartConfig;

  private theme: string | Theme;

  private rule: Rule;

  constructor(props: ChartProviderProps) {
    super(props);
    this.language = props.language || 'zh-cn';
    this.locale = props.locale;
    this.defaultConfig = props.defaultConfig;
    this.theme = props.theme;
    this.rule = props.rule;
  }

  render() {
    return (
      <ChartContext.Provider
        value={{
          language: this.language,
          locale: this.locale,
          defaultConfig: this.defaultConfig,
          theme: this.theme,
          rule: this.rule,
        }}
      >
        {this.props.children}
      </ChartContext.Provider>
    );
  }
}

export default ChartProvider;

// 优先级: setLanguage设置的语言 > 图表中的自定义locale > provider的locale > 图表中的language > provider的language
export const getText = (
  value: keyof LocaleItem,
  language: keyof typeof LanguageMap,
  locale: LocaleItem | Record<string, LocaleItem> = null,
) => {
  console.log(locale, currentLanguage, language, value);
  // 如果用户自定义locale为Record<string, LocaleItem>
  if (locale && (currentLanguage in locale || language in locale || 'zh-cn' in locale)) {
    return currentLanguage && currentLanguage in locale
      ? locale?.[currentLanguage]?.[value]
      : locale?.[language in locale ? language : 'zh-cn']?.[value];
  }

  return currentLanguage && currentLanguage in LanguageMap
    ? LanguageMap?.[currentLanguage]?.[value]
    : locale?.[value] || LanguageMap?.[language in LanguageMap ? language : 'zh-cn']?.[value];
};
