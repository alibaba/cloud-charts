import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onThemeChange,
  onLanguageChange,
  getThemeName,
  getLanguage,
  injectCSSVariables,
} from '@alicloud/cloud-charts-core';

export interface ChartProviderValue {
  theme?: string;
  locale?: string;
}

export interface ChartProviderProps extends ChartProviderValue {
  children?: React.ReactNode;
}

const ChartContext = createContext<ChartProviderValue>({});

/**
 * React ChartProvider：提供 theme/locale context 给所有子图表组件。
 * 同时订阅全局 setTheme/setLanguage 事件，在事件触发时自动 re-render 子树。
 * props.theme / props.locale 优先级高于全局状态。
 */
export function ChartProvider({ children, locale, theme }: ChartProviderProps): JSX.Element {
  const [globalTheme, setGlobalTheme] = useState(getThemeName);
  const [globalLocale, setGlobalLocale] = useState(getLanguage);

  useEffect(() => {
    const unsub1 = onThemeChange((name) => setGlobalTheme(name));
    const unsub2 = onLanguageChange((lang) => setGlobalLocale(lang));
    return () => { unsub1(); unsub2(); };
  }, []);

  useEffect(() => {
    injectCSSVariables(theme ?? globalTheme);
  }, [theme, globalTheme]);

  const value: ChartProviderValue = {
    theme: theme ?? globalTheme,
    locale: locale ?? globalLocale,
  };

  return (
    <ChartContext.Provider value={value}>
      {children}
    </ChartContext.Provider>
  );
}

export function useChartProvider(): ChartProviderValue {
  return useContext(ChartContext);
}
