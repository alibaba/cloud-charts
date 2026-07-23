import { useEffect, useState } from 'react';
import {
  onThemeChange,
  getThemeName,
  resolveTheme,
  type ResolvedTheme,
} from '@alicloud/cloud-charts-core';
import { useChartProvider } from '../provider/index';

export interface UseThemeResult {
  /** 当前主题名（'normal' / 'dark' / 'yunxiao' 等），优先取 props 或 provider，缺省取全局 setTheme 状态 */
  name: string;
  /** 解析后的主题 token + G2 5 主题对象 */
  theme: ResolvedTheme;
}

/**
 * useTheme：在组件内获取当前主题。
 * 解析顺序：override > ChartProvider context > 全局 setTheme()。
 * 订阅全局 setTheme 事件，主题切换时自动 re-render。
 *
 * @param override 显式指定主题名（最高优先级）
 */
export function useTheme(override?: string): UseThemeResult {
  const provider = useChartProvider();
  const [globalTheme, setGlobalTheme] = useState<string>(getThemeName);

  useEffect(() => {
    const unsubscribe = onThemeChange((name) => setGlobalTheme(name));
    return () => {
      unsubscribe();
    };
  }, []);

  const name = override ?? provider.theme ?? globalTheme ?? 'normal';
  const theme = resolveTheme(name);
  return { name, theme };
}
