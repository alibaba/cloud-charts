import { createContext, useContext, createSignal, onCleanup, createMemo, type JSX } from 'solid-js';
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
  children?: JSX.Element;
}

const ChartContext = createContext<ChartProviderValue>({});

/**
 * Solid ChartProvider：提供 theme/locale context 给所有子图表组件。
 * 同时订阅全局 setTheme/setLanguage 事件，在事件触发时通过 signal 更新子树。
 * props.theme / props.locale 优先级高于全局状态。
 */
export function ChartProvider(props: ChartProviderProps): JSX.Element {
  const [globalTheme, setGlobalTheme] = createSignal(getThemeName());
  const [globalLocale, setGlobalLocale] = createSignal(getLanguage());

  const unsub1 = onThemeChange((name) => setGlobalTheme(name));
  const unsub2 = onLanguageChange((lang) => setGlobalLocale(lang));
  onCleanup(() => { unsub1(); unsub2(); });

  const resolvedTheme = createMemo(() => props.theme ?? globalTheme());
  const resolvedLocale = createMemo(() => props.locale ?? globalLocale());

  createMemo(() => injectCSSVariables(resolvedTheme()));

  const value = createMemo<ChartProviderValue>(() => ({
    theme: resolvedTheme(),
    locale: resolvedLocale(),
  }));

  return (
    <ChartContext.Provider value={value()}>
      {props.children}
    </ChartContext.Provider>
  );
}

export function useChartProvider(): ChartProviderValue {
  return useContext(ChartContext);
}
