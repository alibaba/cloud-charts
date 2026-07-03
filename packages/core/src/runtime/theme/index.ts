import type { ResolvedTheme, ThemeToken } from '../types';
import { builtInThemeTokens, DEFAULT_THEME_NAME } from './tokens';
import { createG2Theme } from './g2Theme';
import { emit, on } from '../eventBus';

export { createG2Theme } from './g2Theme';
export { builtInThemeTokens, DEFAULT_THEME_NAME } from './tokens';

const THEME_CHANGE_EVENT = 'setTheme';

let currentThemeName: string = DEFAULT_THEME_NAME;

function isThemeToken(value: unknown): value is ThemeToken {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 解析运行时主题。
 * - 传入字符串：从内置 token 注册表中取对应主题，找不到时回退到默认主题。
 * - 传入 token 对象：在默认 token 之上合并，支持局部自定义。
 * - 传入空值：使用默认主题。
 */
export function resolveTheme(theme?: string | ThemeToken): ResolvedTheme {
  if (typeof theme === 'string') {
    const token = builtInThemeTokens[theme] || builtInThemeTokens[DEFAULT_THEME_NAME];
    return {
      name: builtInThemeTokens[theme] ? theme : DEFAULT_THEME_NAME,
      token,
      g2Theme: createG2Theme(token),
    };
  }

  if (isThemeToken(theme)) {
    const mergedToken: ThemeToken = {
      ...builtInThemeTokens[DEFAULT_THEME_NAME],
      ...theme,
    };
    return {
      name: 'custom',
      token: mergedToken,
      g2Theme: createG2Theme(mergedToken),
    };
  }

  const defaultToken = builtInThemeTokens[DEFAULT_THEME_NAME];
  return {
    name: DEFAULT_THEME_NAME,
    token: defaultToken,
    g2Theme: createG2Theme(defaultToken),
  };
}

/** 获取当前全局主题名（模块级状态）。 */
export function getThemeName(): string {
  return currentThemeName;
}

/**
 * 全局设置主题。触发 eventBus 'setTheme' 事件，所有订阅方（Provider/useChart）会收到通知并 re-render。
 * 同时将 CSS 变量注入到 document（如在浏览器环境）。
 */
export function setTheme(name: string): void {
  currentThemeName = name;
  injectCSSVariables(name);
  emit(THEME_CHANGE_EVENT, name);
}

/** 订阅主题变化事件。返回取消订阅函数。 */
export function onThemeChange(fn: (name: string) => void): () => void {
  return on(THEME_CHANGE_EVENT, fn as (...args: unknown[]) => void);
}

/**
 * 将主题 token 以 CSS 变量写入 `<style id="widgets-theme-var">`，
 * 复现旧 src/themes/themeTools.ts 的 setThemeStyle 行为。
 * 仅浏览器环境下生效。
 */
export function injectCSSVariables(themeName?: string): void {
  if (typeof document === 'undefined') return;

  const name = themeName || currentThemeName;
  const token = builtInThemeTokens[name] || builtInThemeTokens[DEFAULT_THEME_NAME];
  const css = Object.entries(token)
    .filter(([, v]) => typeof v === 'string' || typeof v === 'number')
    .map(([k, v]) => `  --${k}: ${v};`)
    .join('\n');

  const STYLE_ID = 'widgets-theme-var';
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `.widgets-chart-root, :root {\n${css}\n}`;
}
