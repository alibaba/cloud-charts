import { registerTheme } from "@antv/g2/esm/core";
import { createThemeByStyleSheet } from '@antv/g2/esm/theme/util/create-by-style-sheet';
import { Types } from '../common/types';
import normalStyle from './normal.style';
import { pxToNumber } from "../common/common";
import { FullCrossName } from '../constants';

export interface Theme extends Partial<typeof normalStyle> {
  name?: string;
  category_12?: string[];
  linear_10?: string[];
  order_10?: string[];
  // [key: string]: number | string | string[];
}

// ---------------------- CSS ----------------------
const widgetsThemeStyleId = 'widgets-theme-var';

function getStyleElement() {
  let el = document.getElementById(widgetsThemeStyleId);
  if (!el) {
    el = document.createElement('style');
    el.setAttribute('id', widgetsThemeStyleId);
    document.head.appendChild(el);
  }
  return el;
}

export function setThemeStyle(css: string) {
  const style = getStyleElement();
  style.innerText = css;
}

export function convertCSS(theme: Theme) {
  const varList = Object.keys(theme).map((key: keyof Theme) => `--${key}: ${theme[key]}`);
  return `.${FullCrossName} {${varList.join(';')}}`;
}

// ---------------------- JS ----------------------

/**
 * 将主题包中横杠连接符变量克隆转为小驼峰写法
 *
 * @param {Theme} themes 主题包
 *
 * @return {Theme} themes
 * */
export function convertKey(themes: Theme) {
  Object.keys(themes).forEach((key) => {
    if (key.indexOf('-') > -1) {
      const newKey = key.replace(/-(\w)/g, (all, letter) => {
        return letter.toUpperCase();
      });
      // @ts-ignore
      if (!themes[newKey]) {
        // @ts-ignore
        themes[newKey] = themes[key];
      }
    }
  });
  return themes;
}

export function convertJsStyle(name: string, theme: Theme): Theme {
  const result = {
    name,
    // 分类色阶
    category_12: [
      theme['widgets-color-category-1'],
      theme['widgets-color-category-2'],
      theme['widgets-color-category-3'],
      theme['widgets-color-category-4'],
      theme['widgets-color-category-5'],
      theme['widgets-color-category-6'],
      theme['widgets-color-category-7'],
      theme['widgets-color-category-8'],
      theme['widgets-color-category-9'],
      theme['widgets-color-category-10'],
      theme['widgets-color-category-11'],
      theme['widgets-color-category-12'],
    ],
    // 连续色阶，比较接近的颜色会错开
    linear_10: [
      theme['widgets-color-linear-1'],
      theme['widgets-color-linear-5'],
      theme['widgets-color-linear-9'],
      theme['widgets-color-linear-3'],
      theme['widgets-color-linear-7'],
      theme['widgets-color-linear-10'],
      theme['widgets-color-linear-2'],
      theme['widgets-color-linear-4'],
      theme['widgets-color-linear-6'],
      theme['widgets-color-linear-8'],
    ],
    // 顺序色阶，连续相似的颜色排列
    order_10: [
      theme['widgets-color-linear-1'],
      theme['widgets-color-linear-2'],
      theme['widgets-color-linear-3'],
      theme['widgets-color-linear-4'],
      theme['widgets-color-linear-5'],
      theme['widgets-color-linear-6'],
      theme['widgets-color-linear-7'],
      theme['widgets-color-linear-8'],
      theme['widgets-color-linear-9'],
      theme['widgets-color-linear-10'],
    ],
  };
  Object.assign(result, theme);

  return result;
}

function getG2StyleSheet(theme: Theme): Types.StyleSheet {
  const fontSize1 = pxToNumber(theme['widgets-font-size-1']);

  const BLACK_COLORS = {
    100: '#000',
    95: '#0D0D0D',
    85: '#262626',
    65: '#595959',
    45: '#8C8C8C',
    25: '#BFBFBF',
    15: '#D9D9D9',
    6: '#F0F0F0',
  };

  const WHITE_COLORS = {
    100: '#FFFFFF',
    95: '#F2F2F2',
    85: '#D9D9D9',
    65: '#A6A6A6',
    45: '#737373',
    25: '#404040',
    15: '#262626',
    6: '#0F0F0F',
  };

  const QUALITATIVE_10 = [
    theme['widgets-color-category-1'],
    theme['widgets-color-category-2'],
    theme['widgets-color-category-3'],
    theme['widgets-color-category-4'],
    theme['widgets-color-category-5'],
    theme['widgets-color-category-6'],
    theme['widgets-color-category-7'],
    theme['widgets-color-category-8'],
    theme['widgets-color-category-9'],
    theme['widgets-color-category-10'],
  ];

  const QUALITATIVE_20 = [
    '#5B8FF9',
    '#CDDDFD',
    '#5AD8A6',
    '#CDF3E4',
    '#5D7092',
    '#CED4DE',
    '#F6BD16',
    '#FCEBB9',
    '#E86452',
    '#F8D0CB',
    '#6DC8EC',
    '#D3EEF9',
    '#945FB9',
    '#DECFEA',
    '#FF9845',
    '#FFE0C7',
    '#1E9493',
    '#BBDEDE',
    '#FF99C3',
    '#FFE0ED',
  ];

  return {
    /** 图表背景色 */
    backgroundColor: 'transparent',
    /** 主题色 */
    brandColor: QUALITATIVE_10[0],
    /** 分类色板 1，在数据量小于等于 10 时使用 */
    paletteQualitative10: QUALITATIVE_10,
    /** 分类色板 2，在数据量大于 10 时使用 */
    paletteQualitative20: QUALITATIVE_20,
    /** 语义色 */
    paletteSemanticRed: theme['widgets-color-red'],
    /** 语义色 */
    paletteSemanticGreen: theme['widgets-color-green'],
    /** 语义色 */
    paletteSemanticYellow: theme['widgets-color-orange'],
    /** 字体 */
    fontFamily: theme['widgets-font-family-txd-m-number'],

    // -------------------- 坐标轴 --------------------
    /** 坐标轴线颜色 */
    axisLineBorderColor: theme['widgets-axis-line'],
    /** 坐标轴线粗细 */
    axisLineBorder: 1,
    /** 坐标轴线 lineDash 设置 */
    axisLineDash: null,

    /** 坐标轴标题颜色 */
    axisTitleTextFillColor: theme['widgets-axis-label'],
    /** 坐标轴标题文本字体大小 */
    axisTitleTextFontSize: fontSize1,
    /** 坐标轴标题文本行高 */
    axisTitleTextLineHeight: fontSize1,
    /** 坐标轴标题文本字体粗细 */
    axisTitleTextFontWeight: 'normal',
    /** 坐标轴标题距离坐标轴文本的间距 */
    axisTitleSpacing: fontSize1,

    /** 坐标轴刻度线颜色 */
    axisTickLineBorderColor: theme['widgets-axis-line'],
    /** 坐标轴刻度线长度 */
    axisTickLineLength: 4,
    /** 坐标轴刻度线粗细 */
    axisTickLineBorder: 1,

    /** 坐标轴次刻度线颜色 */
    axisSubTickLineBorderColor: theme['widgets-axis-line'],
    /** 坐标轴次刻度线长度 */
    axisSubTickLineLength: 2,
    /** 坐标轴次刻度线粗细 */
    axisSubTickLineBorder: 1,

    /** 坐标轴刻度文本颜色 */
    axisLabelFillColor: BLACK_COLORS[45],
    /** 坐标轴刻度文本字体大小 */
    axisLabelFontSize: fontSize1,
    /** 坐标轴刻度文本行高 */
    axisLabelLineHeight: fontSize1,
    /** 坐标轴刻度文本字体粗细 */
    axisLabelFontWeight: 'normal',
    /** 坐标轴刻度文本距离坐标轴线的间距 */
    axisLabelOffset: fontSize1, // CHECK 8px 还是 12px

    /** 坐标轴网格线颜色 */
    axisGridBorderColor: theme['widgets-axis-grid'],
    /** 坐标轴网格线粗细 */
    axisGridBorder: 1,
    /** 坐标轴网格线虚线设置 */
    axisGridLineDash: null,

    // -------------------- 图例 --------------------
    /** 图例标题颜色 */
    legendTitleTextFillColor: theme['widgets-legend-text'],
    /** 图例标题文本字体大小 */
    legendTitleTextFontSize: fontSize1,
    /** 图例标题文本行高 */
    legendTitleTextLineHeight: fontSize1 * 1.5,
    /** 图例标题文本字体粗细 */
    legendTitleTextFontWeight: 'normal',

    /** 图例 marker 颜色 */
    legendMarkerColor: QUALITATIVE_10[0],
    /** 图例 marker 距离图例文本的间距 */
    legendMarkerSpacing: fontSize1 / 3,
    /** 图例 marker 默认半径大小 */
    legendMarkerSize: fontSize1 / 3,
    /** 图例 'circle' marker 半径 */
    legendCircleMarkerSize: fontSize1 / 3,
    /** 图例 'square' marker 半径 */
    legendSquareMarkerSize: fontSize1 / 3,
    /** 图例 'line' marker 半径 */
    legendLineMarkerSize: fontSize1 / 3, // CHECK 图例项标记样式

    /** 图例项文本颜色 */
    legendItemNameFillColor: theme['widgets-legend-text'],
    /** 图例项文本字体大小 */
    legendItemNameFontSize: fontSize1,
    /** 图例项文本行高 */
    legendItemNameLineHeight: fontSize1,
    /** 图例项粗细 */
    legendItemNameFontWeight: 'normal',
    /** 图例项之间的水平间距 */
    legendItemSpacing: fontSize1,
    /** 图例项垂直方向的间隔 */
    legendItemMarginBottom: fontSize1,
    /** 图例与图表绘图区域的偏移距离  */
    legendPadding: [8, 8, 8, 8],

    /** 连续图例滑块填充色 */
    sliderRailFillColor: BLACK_COLORS[15],
    /** 连续图例滑块边框粗细 */
    sliderRailBorder: 0,
    /** 连续图例滑块边框颜色 */
    sliderRailBorderColor: null,
    /** 连续图例滑块宽度 */
    sliderRailWidth: 100,
    /** 连续图例滑块高度 */
    sliderRailHeight: 12,

    /** 连续图例文本颜色 */
    sliderLabelTextFillColor: theme['widgets-legend-text'],
    /** 连续图例文本字体大小 */
    sliderLabelTextFontSize: fontSize1,
    /** 连续图例文本行高 */
    sliderLabelTextLineHeight: fontSize1,
    /** 连续图例文本字体粗细 */
    sliderLabelTextFontWeight: 'normal',

    /** 连续图例滑块颜色 */
    sliderHandlerFillColor: BLACK_COLORS[6],
    /** 连续图例滑块宽度 */
    sliderHandlerWidth: 10,
    /** 连续图例滑块高度 */
    sliderHandlerHeight: 14,
    /** 连续图例滑块边框粗细 */
    sliderHandlerBorder: 1,
    /** 连续图例滑块边框颜色 */
    sliderHandlerBorderColor: BLACK_COLORS[25],

    // -------------------- Annotation，图形标注 --------------------
    /** arc 图形标注描边颜色 */
    annotationArcBorderColor: BLACK_COLORS[15],
    /** arc 图形标注粗细 */
    annotationArcBorder: 1,

    /** line 图形标注颜色 */
    annotationLineBorderColor: BLACK_COLORS[25],
    /** line 图形标注粗细 */
    annotationLineBorder: 1,
    /** lube 图形标注的虚线间隔 */
    annotationLineDash: null,

    /** text 图形标注文本颜色 */
    annotationTextFillColor: BLACK_COLORS[65],
    /** text 图形标注文本字体大小 */
    annotationTextFontSize: 12,
    /** text 图形标注文本行高 */
    annotationTextLineHeight: 12,
    /** text 图形标注文本字体粗细 */
    annotationTextFontWeight: 'normal',
    /** text 图形标注文本边框颜色 */
    annotationTextBorderColor: null,
    /** text 图形标注文本边框粗细 */
    annotationTextBorder: 0,

    /** region 图形标注填充颜色 */
    annotationRegionFillColor: BLACK_COLORS[100],
    /** region 图形标注填充颜色透明色 */
    annotationRegionFillOpacity: theme['widgets-guide-region-opacity'],
    /** region 图形标注描边粗细 */
    annotationRegionBorder: 0,
    /** region 图形标注描边颜色 */
    annotationRegionBorderColor: null,

    /** dataMarker 图形标注线的长度 */
    annotationDataMarkerLineLength: 16,

    // -------------------- Tooltip --------------------
    /** tooltip crosshairs 辅助线颜色 */
    tooltipCrosshairsBorderColor: theme['widgets-tooltip-cross-line'],
    /** tooltip crosshairs 辅助线粗细 */
    tooltipCrosshairsBorder: 1,
    /** tooltip crosshairs 辅助线虚线间隔 */
    tooltipCrosshairsLineDash: null,

    /** tooltip 内容框背景色 */
    tooltipContainerFillColor: theme['widgets-tooltip-background'],
    tooltipContainerFillOpacity: 1,
    /** tooltip 内容框阴影 */
    tooltipContainerShadow: theme['widgets-tooltip-shadow'],
    /** tooltip 内容框圆角 */
    tooltipContainerBorderRadius: pxToNumber(theme['widgets-tooltip-corner-radius']),

    /** tooltip 文本颜色 */
    tooltipTextFillColor: theme['widgets-tooltip-text'],
    /** tooltip 文本字体大小 */
    tooltipTextFontSize: fontSize1,
    /** tooltip 文本行高 */
    tooltipTextLineHeight: fontSize1,
    /** tooltip 文本字体粗细 */
    tooltipTextFontWeight: 'normal',

    // -------------------- Geometry labels --------------------
    /** Geometry label 文本颜色 */
    labelFillColor: theme['widgets-label-text'],
    labelFillColorDark: theme['widgets-label-text'],
    labelFillColorLight: '#ffffff',
    /** Geometry label 文本字体大小 */
    labelFontSize: fontSize1,
    /** Geometry label 文本行高 */
    labelLineHeight: fontSize1,
    /** Geometry label 文本字体粗细 */
    labelFontWeight: 'normal',
    /** Geometry label 文本描边颜色 */
    labelBorderColor: null,
    /** Geometry label 文本描边粗细 */
    labelBorder: 0,

    /** Geometry innerLabel 文本颜色 */
    innerLabelFillColor: WHITE_COLORS[100], // CHECK
    /** Geometry innerLabel 文本字体大小 */
    innerLabelFontSize: fontSize1,
    /** Geometry innerLabel 文本行高 */
    innerLabelLineHeight: fontSize1,
    /** Geometry innerLabel 文本字体粗细 */
    innerLabelFontWeight: 'normal',
    /** Geometry innerLabel 文本描边颜色 */
    innerLabelBorderColor: null,
    /** Geometry innerLabel 文本描边粗细 */
    innerLabelBorder: 0,

    /** Geometry label　文本连接线粗细 */
    labelLineBorder: 1,
    /** Geometry label 文本连接线颜色 */
    labelLineBorderColor: theme['widgets-label-text'], // CHECK

    // -------------------- Geometry 图形样式--------------------
    /** 点图填充颜色 */
    pointFillColor: QUALITATIVE_10[0],
    /** 点图填充颜色透明度 */
    pointFillOpacity: 0.95,
    /** 点图大小 */
    pointSize: 4,
    /** 点图描边粗细 */
    pointBorder: 1,
    /** 点图描边颜色 */
    pointBorderColor: WHITE_COLORS[100],
    /** 点图描边透明度 */
    pointBorderOpacity: 1,

    /** 点图 active 状态下描边颜色 */
    pointActiveBorderColor: BLACK_COLORS[100],

    /** 点图 selected 状态下描边粗细 */
    pointSelectedBorder: 2,
    /** 点图 selected 状态下描边颜色 */
    pointSelectedBorderColor: BLACK_COLORS[100],

    /** 点图 inactive 状态下填充颜色透明度 */
    pointInactiveFillOpacity: 0.3,
    /** 点图 inactive 状态下描边透明度 */
    pointInactiveBorderOpacity: 0.3,

    /** 空心点图大小 */
    hollowPointSize: 4,
    /** 空心点图描边粗细 */
    hollowPointBorder: 1,
    /** 空心点图描边颜色 */
    hollowPointBorderColor: QUALITATIVE_10[0],
    /** 空心点图描边透明度 */
    hollowPointBorderOpacity: 0.95,
    hollowPointFillColor: WHITE_COLORS[100],

    /** 空心点图 active 状态下描边粗细 */
    hollowPointActiveBorder: 1,
    /** 空心点图 active 状态下描边颜色 */
    hollowPointActiveBorderColor: BLACK_COLORS[100],
    /** 空心点图 active 状态下描边透明度 */
    hollowPointActiveBorderOpacity: 1,

    /** 空心点图 selected 状态下描边粗细 */
    hollowPointSelectedBorder: 2,
    /** 空心点图 selected 状态下描边颜色 */
    hollowPointSelectedBorderColor: BLACK_COLORS[100],
    /** 空心点图 selected 状态下描边透明度 */
    hollowPointSelectedBorderOpacity: 1,

    /** 空心点图 inactive 状态下描边透明度 */
    hollowPointInactiveBorderOpacity: 0.3,

    /** 线图粗细 */
    lineBorder: 2,
    /** 线图颜色 */
    lineBorderColor: QUALITATIVE_10[0],
    /** 线图透明度 */
    lineBorderOpacity: 1,

    /** 线图 Active 状态下粗细 */
    lineActiveBorder: 3,

    /** 线图 selected 状态下粗细 */
    lineSelectedBorder: 3,

    /** 线图 inactive 状态下透明度 */
    lineInactiveBorderOpacity: 0.3,

    /** area 填充颜色 */
    areaFillColor: QUALITATIVE_10[0],
    /** area 填充透明度 */
    areaFillOpacity: theme['widgets-shape-area-opacity'],

    /** area 在 active 状态下的填充透明度 */
    areaActiveFillColor: QUALITATIVE_10[0],
    areaActiveFillOpacity: 0.5,

    /** area 在 selected 状态下的填充透明度 */
    areaSelectedFillColor: QUALITATIVE_10[0],
    areaSelectedFillOpacity: 0.5,

    /** area inactive 状态下填充透明度 */
    areaInactiveFillOpacity: 0.3,

    /** hollowArea 颜色 */
    hollowAreaBorderColor: QUALITATIVE_10[0],
    /** hollowArea 边框粗细 */
    hollowAreaBorder: 2,
    /** hollowArea 边框透明度 */
    hollowAreaBorderOpacity: 1,

    /** hollowArea active 状态下的边框粗细 */
    hollowAreaActiveBorder: 3,
    hollowAreaActiveBorderColor: BLACK_COLORS[100],

    /** hollowArea selected 状态下的边框粗细 */
    hollowAreaSelectedBorder: 3,
    hollowAreaSelectedBorderColor: BLACK_COLORS[100],

    /** hollowArea inactive 状态下的边框透明度 */
    hollowAreaInactiveBorderOpacity: 0.3,

    /** interval 填充颜色 */
    intervalFillColor: QUALITATIVE_10[0],
    /** interval 填充透明度 */
    intervalFillOpacity: theme['widgets-shape-interval-opacity'],

    /** interval active 状态下边框粗细 */
    intervalActiveBorder: 1,
    /** interval active 状态下边框颜色 */
    intervalActiveBorderColor: BLACK_COLORS[100],
    intervalActiveBorderOpacity: 1,

    /** interval selected 状态下边框粗细 */
    intervalSelectedBorder: 2,
    /** interval selected 状态下边框颜色 */
    intervalSelectedBorderColor: BLACK_COLORS[100],
    /** interval selected 状态下边框透明度 */
    intervalSelectedBorderOpacity: 1,

    /** interval inactive 状态下边框透明度 */
    intervalInactiveBorderOpacity: 0.3,
    /** interval inactive 状态下填充透明度 */
    intervalInactiveFillOpacity: 0.3,

    /** interval 边框粗细 */
    hollowIntervalBorder: 2,
    /** hollowInterval 边框颜色 */
    hollowIntervalBorderColor: QUALITATIVE_10[0],
    /** hollowInterval 边框透明度 */
    hollowIntervalBorderOpacity: 1,
    hollowIntervalFillColor: WHITE_COLORS[100],

    /** hollowInterval active 状态下边框粗细 */
    hollowIntervalActiveBorder: 2,
    /** hollowInterval active 状态下边框颜色 */
    hollowIntervalActiveBorderColor: BLACK_COLORS[100],

    /** hollowInterval selected 状态下边框粗细 */
    hollowIntervalSelectedBorder: 3,
    /** hollowInterval selected 状态下边框颜色 */
    hollowIntervalSelectedBorderColor: BLACK_COLORS[100],
    /** hollowInterval selected 状态下边框透明度 */
    hollowIntervalSelectedBorderOpacity: 1,

    /** hollowInterval inactive 状态下边框透明度 */
    hollowIntervalInactiveBorderOpacity: 0.3,
  };
}

export function setG2Theme(theme: Theme) {
  const g2StyleSheet = getG2StyleSheet(theme);

  const g2Theme = createThemeByStyleSheet(g2StyleSheet);

  // g2Theme.maxColumnWidth = 36;
  const baseFontSize = theme['widgets-font-size-1'];
  const baseFontSizeNum = pxToNumber(theme['widgets-font-size-1']);
  // tooltip 样式
  const tooltipStyle = g2Theme.components.tooltip.domStyles;
  Object.assign(tooltipStyle['g2-tooltip'], {
    padding: `0 ${baseFontSize} 0 ${baseFontSize}`,
  });
  Object.assign(tooltipStyle['g2-tooltip-title'], {
    marginBottom: baseFontSize,
    marginTop: baseFontSize,
  });
  Object.assign(tooltipStyle['g2-tooltip-list-item'], {
    marginBottom: baseFontSize,
    marginTop: baseFontSize,
  });
  Object.assign(tooltipStyle['g2-tooltip-marker'], {
    width: `${baseFontSizeNum / 2}px`,
    height: `${baseFontSizeNum / 2}px`,
    marginRight: `${baseFontSizeNum / 3}px`,
  });
  // slider 样式
  const sliderStyle = g2Theme.components.slider.common;
  const p = baseFontSizeNum * 2 / 3;
  sliderStyle.padding = [baseFontSizeNum, p, 0, 0];
  sliderStyle.height = 3 * baseFontSizeNum;
  sliderStyle.textStyle = {
    opacity: 0,
  };

  registerTheme('default', g2Theme);
}
