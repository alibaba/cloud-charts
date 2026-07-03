import type { ThemeToken } from '../types';

const statusColorTokenMap: Record<string, string> = {
  error: 'widgets-color-red',
  red: 'widgets-color-red',
  warning: 'widgets-color-orange',
  orange: 'widgets-color-orange',
  blue: 'widgets-color-blue',
  normal: 'widgets-color-normal',
  primary: 'widgets-color-primary',
  success: 'widgets-color-green',
  green: 'widgets-color-green',
  none: 'widgets-color-gray',
  gray: 'widgets-color-gray',
};

const statusColorNameMap: Record<string, string> = {
  error: 'red',
  warning: 'orange',
  normal: 'normal',
  success: 'green',
  none: 'gray',
  primary: 'primary',
  blue: 'blue',
};

const paletteTokenIndexMap: Record<string, number[]> = {
  category_12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  category_20: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  linear_10: [1, 5, 9, 3, 7, 10, 2, 4, 6, 8],
  order_10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
};

export function getStatusColor(status: string | undefined, token?: ThemeToken): string | undefined {
  const normalizedStatus = status || 'normal';
  const tokenName = statusColorTokenMap[normalizedStatus];
  const tokenColor = tokenName ? token?.[tokenName] : undefined;
  return typeof tokenColor === 'string' ? tokenColor : normalizedStatus;
}

export function getStatusColorName(status: string | undefined): string {
  return statusColorNameMap[status || 'normal'] || status || statusColorNameMap.normal;
}

export function getThemePalette(token: ThemeToken, paletteName = 'category_12'): string[] {
  const customPalette = token[paletteName];
  if (Array.isArray(customPalette)) {
    return customPalette.filter((color): color is string => typeof color === 'string' && color.length > 0);
  }

  const colorPrefix = paletteName === 'linear_10' || paletteName === 'order_10' ? 'widgets-color-linear' : 'widgets-color-category';
  const paletteIndexes = paletteTokenIndexMap[paletteName] || paletteTokenIndexMap.category_12;
  return paletteIndexes
    .map((colorIndex) => token[`${colorPrefix}-${colorIndex}`])
    .filter((color): color is string => typeof color === 'string' && color.length > 0);
}

export function mergeColorRange(baseColors: string[] | undefined, overrideColors: string[] | undefined): string[] | undefined {
  if (!baseColors && !overrideColors) {
    return undefined;
  }

  const mergedColors = [...(baseColors || [])];
  overrideColors?.forEach((overrideColor, colorIndex) => {
    mergedColors[colorIndex] = overrideColor;
  });
  return mergedColors.length > 0 ? mergedColors : undefined;
}

function stripHexAlpha(color: string): string {
  return /^#[0-9a-fA-F]{8}$/.test(color) ? color.slice(0, 7) : color;
}

function getFirstGradientColor(color: string): string {
  const gradientColor = color.match(/#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?/);
  return gradientColor ? stripHexAlpha(gradientColor[0]) : color;
}

export function getAreaColors(areaColors: string[] | undefined, isStack?: boolean): string[] | undefined {
  return areaColors?.map((areaColor) => {
    if (isStack) {
      return getFirstGradientColor(areaColor);
    }
    if (areaColor.includes('l') || areaColor.includes('r') || areaColor.includes('p')) {
      return areaColor;
    }
    return `l(90) 0:${areaColor}70 0.7:${areaColor}66 1:${areaColor}03`;
  });
}

export function getAreaColorRange(
  colors: string[] | undefined,
  areaColors: string[] | undefined,
  isStack?: boolean,
): string[] | undefined {
  return getAreaColors(mergeColorRange(colors, areaColors), isStack);
}

export function mapColors<T extends string | string[] | undefined>(colors: T, token?: ThemeToken): T {
  if (!colors) {
    return colors;
  }

  const mapColor = (color: string): string => {
    const tokenValue = token?.[color];
    return typeof tokenValue === 'string' ? tokenValue : color;
  };

  if (typeof colors === 'string') {
    return mapColor(colors) as T;
  }

  return colors.map(mapColor) as T;
}

export function resolveColorRange(colors: unknown, token: ThemeToken, defaultPaletteName = 'category_12'): string[] | undefined {
  if (Array.isArray(colors)) {
    return mapColors(colors, token);
  }

  if (typeof colors === 'string') {
    const palette = getThemePalette(token, colors);
    return palette.length > 0 ? palette : [mapColors(colors, token)];
  }

  const defaultPalette = getThemePalette(token, defaultPaletteName);
  return defaultPalette.length > 0 ? defaultPalette : undefined;
}

interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

interface HsvColor {
  hue: number;
  saturation: number;
  value: number;
}

function normalizeHexColor(color: string | undefined, fallback: string): string {
  const rawColor = color || fallback;
  if (/^#[0-9a-fA-F]{3}$/.test(rawColor)) {
    return `#${rawColor[1]}${rawColor[1]}${rawColor[2]}${rawColor[2]}${rawColor[3]}${rawColor[3]}`.toLowerCase();
  }
  if (/^#[0-9a-fA-F]{6}$/.test(rawColor)) {
    return rawColor.toLowerCase();
  }
  return fallback;
}

function hexToRgb(color: string): RgbColor {
  const hexColor = normalizeHexColor(color, '#000000');
  return {
    red: parseInt(hexColor.slice(1, 3), 16),
    green: parseInt(hexColor.slice(3, 5), 16),
    blue: parseInt(hexColor.slice(5, 7), 16),
  };
}

function rgbToHex(color: RgbColor): string {
  const toHex = (value: number) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0');
  return `#${toHex(color.red)}${toHex(color.green)}${toHex(color.blue)}`;
}

function rgbToHsv(color: RgbColor): HsvColor {
  const red = color.red / 255;
  const green = color.green / 255;
  const blue = color.blue / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }

  return {
    hue: hue < 0 ? hue + 360 : hue,
    saturation: max === 0 ? 0 : delta / max,
    value: max,
  };
}

function hsvToRgb(color: HsvColor): RgbColor {
  const chroma = color.value * color.saturation;
  const huePrime = color.hue / 60;
  const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));
  const match = color.value - chroma;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma;
    green = secondComponent;
  } else if (huePrime < 2) {
    red = secondComponent;
    green = chroma;
  } else if (huePrime < 3) {
    green = chroma;
    blue = secondComponent;
  } else if (huePrime < 4) {
    green = secondComponent;
    blue = chroma;
  } else if (huePrime < 5) {
    red = secondComponent;
    blue = chroma;
  } else {
    red = chroma;
    blue = secondComponent;
  }

  return {
    red: (red + match) * 255,
    green: (green + match) * 255,
    blue: (blue + match) * 255,
  };
}

function mixColor(backgroundColor: string, foregroundColor: string, amount: number): string {
  const background = hexToRgb(backgroundColor);
  const foreground = hexToRgb(foregroundColor);
  const ratio = Math.max(0, Math.min(100, amount)) / 100;
  return rgbToHex({
    red: background.red * (1 - ratio) + foreground.red * ratio,
    green: background.green * (1 - ratio) + foreground.green * ratio,
    blue: background.blue * (1 - ratio) + foreground.blue * ratio,
  });
}

function generateScaledArray(dataSize: number): number[] {
  const max = 0.75;
  const min = 0.1;
  const scaleArray = [max];
  const distance = 0.1;
  const mean = (0.4 - min) / Math.max(1, dataSize - 5);

  for (let index = 1; index < 6; index += 1) {
    scaleArray.push(max - index * distance);
  }

  for (let index = 6; index < dataSize - 1; index += 1) {
    scaleArray.push(0.4 - mean * (index - 5));
  }

  scaleArray.push(min);
  return scaleArray;
}

export function calcLinearColor(
  primaryColor: string,
  backgroundColor = '#ffffff',
  linearCount = 10,
  type?: string,
  needDistribution?: boolean,
): string[] {
  const linearColors: string[] = [];
  const normalizedPrimaryColor = normalizeHexColor(primaryColor, '#000000');
  const normalizedBackgroundColor = normalizeHexColor(backgroundColor, '#ffffff');
  const frontHsv = rgbToHsv(hexToRgb(normalizedPrimaryColor));
  const backgroundValue = rgbToHsv(hexToRgb(normalizedBackgroundColor)).value;
  const isLightBackground = backgroundValue > 0.5;
  const whiteValue = 1;
  const count = linearCount + 1;

  if (type === 'center') {
    let colorString = normalizedPrimaryColor;
    for (let index = 1; index < count + 1; index += 1) {
      colorString = rgbToHex(
        hsvToRgb({
          hue: frontHsv.hue,
          saturation: (Math.round((index * frontHsv.saturation * 100) / count) + 1) / 100,
          value: Math.round(((index * (frontHsv.value - whiteValue)) / count + whiteValue) * 100) / 100,
        }),
      );

      if (index % 2 === 0 || colorString === normalizedPrimaryColor) {
        linearColors.push(colorString);
      }
    }

    for (let index = count; index > Math.floor(count / 2) + 1; index -= 1) {
      linearColors.push(mixColor('#000000', normalizedPrimaryColor, (index - 2) * 10));
    }

    if (linearColors[Math.floor(linearCount / 2)] !== normalizedPrimaryColor) {
      linearColors[Math.floor(linearCount / 2)] = normalizedPrimaryColor;
    }
    return linearColors;
  }

  if (needDistribution) {
    const distributionArray = generateScaledArray(count);
    for (let index = count - 1; index > 0; index -= 1) {
      const distributionIndex = count - index - 1;
      if (isLightBackground) {
        linearColors.push(
          rgbToHex(
            hsvToRgb({
              hue: frontHsv.hue,
              saturation: distributionArray[distributionIndex] * frontHsv.saturation,
              value: Math.round(((index * (frontHsv.value - backgroundValue)) / count + backgroundValue) * 100) / 100,
            }),
          ),
        );
      } else {
        linearColors.push(mixColor(normalizedBackgroundColor, normalizedPrimaryColor, distributionArray[distributionIndex] * 100));
      }
    }
    return linearColors;
  }

  for (let index = count - 1; index > 0; index -= 1) {
    if (isLightBackground) {
      linearColors.push(
        rgbToHex(
          hsvToRgb({
            hue: frontHsv.hue,
            saturation: Math.round((index / count) * frontHsv.saturation * 100) / 100,
            value: Math.round(((index * (frontHsv.value - backgroundValue)) / count + backgroundValue) * 100) / 100,
          }),
        ),
      );
    } else {
      linearColors.push(mixColor(normalizedBackgroundColor, normalizedPrimaryColor, index * 10));
    }
  }

  return linearColors;
}
