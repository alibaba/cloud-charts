import React from 'react';
import '../.storybook/storybooks.scss';

const THEME_BACKGROUND = {
  normal: '#ffffff',
  dark: '#141414',
  yunxiao: '#ffffff',
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: '统一主题切换（作用于该 story 内所有图：Vanilla / React / 旧 React）',
    defaultValue: 'normal',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'normal', title: 'Normal' },
        { value: 'dark', title: 'Dark' },
        { value: 'yunxiao', title: 'Yunxiao' },
      ],
      dynamicTitle: true,
    },
  },
};

const withTheme = (Story, context) => {
  const theme = context.globals.theme || 'normal';
  const background = THEME_BACKGROUND[theme] || '#ffffff';
  if (typeof document !== 'undefined') {
    // 老 src 的 SCSS 主题选择器依赖该属性（1.1.x 既有行为，仅 storybook 环境使用）
    document.documentElement.setAttribute('data-aisc-theme', theme);
  }
  return React.createElement(
    'div',
    {
      'data-aisc-theme': theme,
      style: { background, padding: 16, minHeight: '100%', transition: 'background 0.2s' },
    },
    React.createElement(Story, { ...context, themeName: theme }),
  );
};

export const decorators = [withTheme];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
