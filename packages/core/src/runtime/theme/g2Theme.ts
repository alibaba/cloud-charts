import type { ThemeToken, ThemeTokenValue } from '../types';

function pxToNumber(value: ThemeTokenValue | undefined): number {
  if (value === undefined || value === null) {
    return 0;
  }
  if (typeof value === 'number') {
    return value;
  }
  return Number(value.toString().replace('px', '')) || 0;
}

function toNumber(value: ThemeTokenValue | undefined, fallback: number): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toString(value: ThemeTokenValue | undefined, fallback: string): string {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  return String(value);
}

function applyColorOpacity(color: string, opacity: number): string {
  if (opacity >= 1 || color.startsWith('rgba') || !/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  const red = parseInt(color.slice(1, 3), 16);
  const green = parseInt(color.slice(3, 5), 16);
  const blue = parseInt(color.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function pickCategoryPalette(token: ThemeToken, count: number): string[] {
  const palette: string[] = [];
  for (let index = 1; index <= count; index += 1) {
    const color = token[`widgets-color-category-${index}`];
    if (typeof color === 'string' && color) {
      palette.push(color);
    }
  }
  return palette;
}

function isDarkBackground(token: ThemeToken): boolean {
  const background = toString(token['widgets-color-background'], '#ffffff').toLowerCase();
  const shortHex = background.length === 4;
  const hex = shortHex
    ? `#${background[1]}${background[1]}${background[2]}${background[2]}${background[3]}${background[3]}`
    : background;
  if (!/^#[0-9a-f]{6}$/.test(hex)) {
    return false;
  }
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance < 128;
}

/**
 * 将 AISC token 适配为 G2 5 spec mode 可用的 theme 对象。
 * 仅生成 spec mode 支持的字段，覆盖折线图视觉所需的色板、字体、坐标轴、图例、tooltip、line 样式。
 */
export function createG2Theme(token: ThemeToken): Record<string, unknown> {
  const fontSize = pxToNumber(token['widgets-font-size-1']) || 12;
  const fontFamily = toString(
    token['widgets-font-family-txd-m-number'],
    "'Helvetica Neue', 'Helvetica', 'PingFang SC', 'Microsoft YaHei', 'Arial', sans-serif",
  );
  const category10 = pickCategoryPalette(token, 10);
  const category20 = pickCategoryPalette(token, 20);
  const brandColor = category10[0] || toString(token['widgets-color-primary'], '#6250f9');
  const lineWidth = toNumber(token['widgets-line-width'], 1.5);
  const areaOpacity = toNumber(token['widgets-shape-area-opacity'], 0.1);
  const intervalOpacity = toNumber(token['widgets-shape-interval-opacity'], 1);

  const axisLabelColor = toString(token['widgets-axis-label'], '#808080');
  const axisLineColor = toString(token['widgets-axis-line'], '#696969');
  const axisGridColor = toString(token['widgets-axis-grid'], 'rgba(229, 229, 229, 0.5)');
  const axisLabelOffset = toNumber(token['widgets-axis-label-offset'], 8);

  const legendTextColor = toString(token['widgets-legend-text'], '#696969');
  const labelTextColor = toString(token['widgets-label-text'], '#333333');

  const tooltipBackground = toString(token['widgets-tooltip-background'], '#ffffff');
  const tooltipBackgroundOpacity = toNumber(token['widgets-tooltip-background-opacity'], 1);
  const tooltipBackgroundBlur = toNumber(token['widgets-tooltip-background-blur'], 0);
  const tooltipTextColor = toString(token['widgets-tooltip-text'], '#333333');
  const tooltipTitleColor = toString(token['widgets-tooltip-title'], '#808080');
  const tooltipCrossColor = toString(token['widgets-tooltip-cross-line'], '#d9d9d9');
  const tooltipRadius = pxToNumber(token['widgets-tooltip-corner-radius']) || 4;
  const tooltipShadow = toString(token['widgets-tooltip-shadow'], '0 3px 8px 0 rgba(0, 0, 0, 0.18)');

  return {
    type: isDarkBackground(token) ? 'classicDark' : 'classic',
    category10,
    category20,
    color: brandColor,
    view: {
      viewFill: 'transparent',
      plotFill: 'transparent',
    },
    text: {
      fill: labelTextColor,
      fontSize,
      fontFamily,
    },
    line: {
      line: {
        lineWidth,
        strokeOpacity: 1,
      },
    },
    area: {
      area: {
        fillOpacity: areaOpacity,
      },
    },
    interval: {
      rect: {
        fillOpacity: intervalOpacity,
      },
    },
    point: {
      point: {
        r: 3,
        fillOpacity: 0.95,
      },
    },
    axis: {
      labelFill: axisLabelColor,
      labelFontSize: fontSize,
      labelFontFamily: fontFamily,
      labelSpacing: axisLabelOffset,
      lineStroke: axisLineColor,
      lineLineWidth: 1,
      tickStroke: axisLineColor,
      tickLength: 4,
      tickLineWidth: 1,
      gridStroke: axisGridColor,
      gridLineWidth: 1,
      gridLineDash: [0, 0],
      titleFill: axisLabelColor,
      titleFontSize: fontSize,
      titleFontFamily: fontFamily,
    },
    legendCategory: {
      itemLabelFill: legendTextColor,
      itemLabelFillOpacity: 1,
      itemLabelFontSize: fontSize,
      itemLabelFontFamily: fontFamily,
      itemMarker: 'hyphen',
      itemMarkerSize: fontSize * 0.75,
      itemMarkerLineWidth: 2,
      itemMarkerFillOpacity: 1,
      itemMarkerStrokeOpacity: 1,
      itemSpacing: [fontSize / 2, fontSize * 1.5],
      rowPadding: fontSize / 2,
      colPadding: fontSize * 1.5,
      title: false,
      titleFill: legendTextColor,
      titleFontSize: fontSize,
    },
    tooltip: {
      css: {
        '.g2-tooltip': {
          background: applyColorOpacity(tooltipBackground, tooltipBackgroundOpacity),
          color: tooltipTextColor,
          padding: '12px 0 12px 12px',
          'border-radius': `${tooltipRadius}px`,
          'box-shadow': tooltipShadow,
          'font-size': `${fontSize}px`,
          'font-family': fontFamily,
          'backdrop-filter': `blur(${tooltipBackgroundBlur}px)`,
          '-webkit-backdrop-filter': `blur(${tooltipBackgroundBlur}px)`,
        },
        '.g2-tooltip-title': {
          color: tooltipTitleColor,
          'padding-right': '12px',
        },
        '.g2-tooltip-list-item': {
          color: tooltipTextColor,
        },
        '.g2-tooltip-name': {
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
          'white-space': 'nowrap',
          flex: '1',
          'min-width': '0',
        },
        '.g2-tooltip-value': {
          color: tooltipTextColor,
          'flex-shrink': '0',
        },
        '.g2-tooltip-list': {
          'max-height': '250px',
          'overflow-y': 'auto',
          'padding-right': '12px',
        },
        '.g2-tooltip-list::-webkit-scrollbar': {
          width: '4px',
          height: '4px',
        },
        '.g2-tooltip-list::-webkit-scrollbar-thumb': {
          'border-radius': '100px',
          background: tooltipCrossColor,
          border: 'none',
        },
        '.g2-tooltip-list::-webkit-scrollbar-track': {
          background: 'transparent',
        },
      },
      crosshairsStroke: tooltipCrossColor,
      crosshairsLineWidth: 1,
    },
  };
}
