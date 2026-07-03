import normalToken from './normal';
import darkToken from './dark';
import yunxiaoToken from './yunxiao';
import type { ThemeToken } from '../../types';

export const builtInThemeTokens: Record<string, ThemeToken> = {
  normal: normalToken as ThemeToken,
  index: normalToken as ThemeToken,
  dark: darkToken as ThemeToken,
  yunxiao: yunxiaoToken as ThemeToken,
};

export const DEFAULT_THEME_NAME = 'normal';

export { normalToken, darkToken, yunxiaoToken };
