'use strict';

import { size, color, fonts } from '../theme/index';
import { pxToNumber } from './common';

export const legendHtmlContainer = {
  overflow: 'auto',
  fontFamily: fonts.fontFamilyTxdMediumNumber,
  fontSize: fonts.fontSizeBaseCaption,
  lineHeight: 1,
  color: color.widgetsLegendText,
};
export const legendHtmlList = {
  textAlign: '',
};
export const legendHtmlListItem = {
  wordBreak: 'break-all',
  marginTop: 0,
  marginBottom: size.s3,
  marginRight: size.s3,
};
export const legendHtmlMarker = {
  width: '6px',
  height: '6px',
  marginRight: size.s1,
  verticalAlign: '1px',
};

export const legendTextStyle = {
  fill: color.widgetsLegendText,
  fontSize: fonts.fontSizeBaseCaption,
};

const widgetsTheme = {
  // 线图只有一个数据时显示点
  showSinglePoint: true,

  snapArray: [0, 1, 2, 2.5, 4, 5, 10],
  // 指定固定 tick 数的逼近值
  snapCountArray: [0, 1, 1.2, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10],

  // 宽度所占的分类的比例
  // widthRatio: {
  //   // 一般的柱状图占比 1/2
  //   column(count, isDodge) {
  //     console.log('widthRatio', count, isDodge);
  //     if (isDodge) {
  //       return Math.max(1 - count * 0.1, 0.5);
  //     } else if (count > 10) {
  //       return Math.min(count / 2 * 0.1, 0.8);
  //     } else {
  //       return Math.min(count * 0.1, 0.5);
  //     }
  //   },
  //   // rose: 0.9999999, // 玫瑰图柱状占比 1
  //   // multiplePie: 1 / 1.3 // 多层的饼图、环图
  // },

  // animate: false,
  // colors: {
  //   'default': COLORS
  // },
  shape: {
    line: {
      lineWidth: 2,
    },
    area: {
      fillOpacity: 0.1,
    },
    interval: {
      fillOpacity: 1,
    },
  },
  label: {
    textStyle: {
      fill: color.widgetsLabelText,
      fontSize: pxToNumber(fonts.fontSizeBaseCaption),
      fontFamily: fonts.fontFamilyTxdRegularNumber,
    },
  },
  innerLabels: {
    textStyle: {
      fill: color.widgetsLabelText,
      fontSize: pxToNumber(fonts.fontSizeBaseCaption),
      fontFamily: fonts.fontFamilyTxdRegularNumber,
    },
  },
  axis: {
    bottom: {
      label: {
        offset: 18,
        autoRotate: false,
        textStyle: {
          fill: color.widgetsAxisLabel,
          fontFamily: fonts.fontFamilyTxdRegularNumber,
        }, // 底部标签文本的颜色
      },
      line: {
        stroke: color.widgetsAxisLine,
      },
      tickLine: null,
    },
    left: {
      label: {
        offset: 8,
        textStyle: {
          fill: color.widgetsAxisLabel,
          fontFamily: fonts.fontFamilyTxdRegularNumber,
        }, // 左部标签文本的颜色
      },
      grid: {
        // 让grid在轴线的下方
        zIndex: -1,
        lineStyle: {
          stroke: color.widgetsAxisGrid,
          lineWidth: 1,
          lineDash: null,
        },
        zeroLineStyle: {
          stroke: color.widgetsAxisLine,
        },
      },
    },
    right: {
      label: {
        offset: 8,
        textStyle: {
          fill: color.widgetsAxisLabel,
          fontFamily: fonts.fontFamilyTxdRegularNumber,
        }, // 右部标签文本的颜色
      },
    },
    circle: {
      label: {
        offset: 8,
        textStyle: {
          fill: color.widgetsAxisLabel,
          fontFamily: fonts.fontFamilyTxdRegularNumber,
        }, // 底部标签文本的颜色
      },
      line: {
        stroke: color.widgetsAxisLine,
      },
      tickLine: null,
      grid: {
        lineStyle: {
          stroke: color.widgetsAxisLine,
        },
      },
    },
    radius: {
      label: {
        offset: 8,
        textStyle: {
          fill: color.widgetsAxisLabel,
          fontFamily: fonts.fontFamilyTxdRegularNumber,
        }, // 底部标签文本的颜色
      },
      line: {
        stroke: color.widgetsAxisLine,
      },
      tickLine: null,
      grid: {
        lineStyle: {
          stroke: color.widgetsAxisLine,
        },
      },
    },
  },
  tooltip: {
    offset: 8,
    crossLine: {
      stroke: color.widgetsTooltipCrossLine,
      // lineWidth: 1,
    },
    'g2-tooltip': {
      backgroundColor: color.widgetsTooltipBackground,
      boxShadow: color.widgetsTooltipShadow,
      padding: size.s3,
      borderRadius: size.s1,
      fontFamily: fonts.fontFamilyTxdMediumNumber,
      fontSize: fonts.fontSizeBaseCaption,
      lineHeight: 1,
      color: color.widgetsTooltipText,
      textAlign: 'left',
    },
    'g2-tooltip-title': {
      marginBottom: 0,
      color: color.widgetsTooltipTitle,
    },
    'g2-tooltip-list': {},
    'g2-tooltip-list-item': {
      marginBottom: 0,
      marginTop: size.s2,
      listStyle: 'none',
    },
    'g2-tooltip-marker': {
      width: '6px',
      height: '6px',
      border: 'none',
      marginRight: size.s1,
    },
    // 如果修改了 tooltip.itemTpl 这里的调整会无效
    'g2-tooltip-value': {
      marginLeft: size.s2,
    },
  },
  tooltipMarker: {
    stroke: color.widgetsTooltipMarkerFill,
    // 如果要让 shadowColor 显示为对应数据颜色，需要 delete G2.Global.tooltipMarker.shadowColor;
    radius: 4,
    // lineWidth: 2,
  },
  tooltipCrosshairsRect: {
    style: {
      fill: color.widgetsTooltipCrossReact,
      opacity: color.widgetsTooltipCrossReactOpacity,
    },
  },
  tooltipCrosshairsLine: {
    style: {
      stroke: color.widgetsTooltipCrossLine,
      lineWidth: 1,
    },
  },
  legend: {
    top: {
      textStyle: {
        fill: color.widgetsLegendText,
      },
      unCheckColor: color.widgetsLegendUncheck,
    },
    right: {
      textStyle: {
        fill: color.widgetsLegendText,
      },
      unCheckColor: color.widgetsLegendUncheck,
    },
    bottom: {
      textStyle: {
        fill: color.widgetsLegendText,
      },
      unCheckColor: color.widgetsLegendUncheck,
    },
    left: {
      textStyle: {
        fill: color.widgetsLegendText,
      },
      unCheckColor: color.widgetsLegendUncheck,
    },
    html: {
      // 注意！ 这个需要和 wmap 中的 G2Map.scss .aisc-widgets-map-legend 的样式一致
      'g2-legend': legendHtmlContainer,
      'g2-legend-list': legendHtmlList,
      'g2-legend-list-item': legendHtmlListItem,
      'g2-legend-marker': legendHtmlMarker,
    },
  },
  guide: {
    line: {
      lineStyle: {
        stroke: color.colorB16,
      },
      text: {
        autoRotate: false,
        style: {
          fill: color.colorB16,
          fontSize: pxToNumber(fonts.fontSizeBaseCaption),
          fontFamily: fonts.fontFamilyTxdMediumNumber,
        },
      },
    },
    region: {
      style: {
        fill: color.colorB16, // 辅助框填充的颜色
        fillOpacity: 0.1, // 辅助框的背景透明度
      }, // 辅助框的图形样式属性
    },
  },
};

// 设置全局G2主题
export default function setG2Theme(G2) {
  const theme = G2.Util.deepMix({}, G2.Global, widgetsTheme);

  // 设置屏幕dpi缩放（如果有效的话）
  if (window && window.devicePixelRatio) {
    theme.pixelRatio = window.devicePixelRatio;
  }

  // 将主题设置为自定义的主题
  G2.Global.setTheme(theme);
}

