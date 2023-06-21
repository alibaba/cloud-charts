import React, { Component } from 'react';
import LanguageMap, { LocaleItem } from '../locales';
import { BaseChartConfig, Language } from '../common/types';
import { Theme } from '../themes/themeTools';
import eventBus from '../common/eventBus';
import { FullLanguageName, FullLanguageEventName } from '../constants';

export interface ChartProviderProps {
  language?: Language;
  locale?: LocaleItem;
  defaultConfig?: BaseChartConfig;
  theme?: string | Theme;
  rule?:
    | boolean
    | {
        /** 极端数据场景开关,true表示关闭对应处理 */
        extreme?:
          | boolean
          | {
              // 柱图是否左对齐
              alignLeft?: boolean;
              // 是否显示占位
              showPlaceholder?: boolean;
            };
      };
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

  private locale: LocaleItem;

  private config: BaseChartConfig;

  constructor(props: ChartProviderProps) {
    super(props);
    this.language = props.language || 'zh-cn';
    this.locale = props.locale;
    this.config = props.config;
  }

  render() {
    return (
      <ChartContext.Provider
        value={{
          language: this.language,
          locale: this.locale,
          config: this.config,
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
  return currentLanguage && currentLanguage in LanguageMap
    ? LanguageMap?.[currentLanguage]?.[value]
    : locale?.[value] || LanguageMap?.[language in LanguageMap ? language : 'zh-cn']?.[value];
};
