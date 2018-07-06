'use strict';

import { size, color, fonts } from '../theme/normal';

const widgetsTheme = {
  // 线图只有一个数据时显示点
  showSinglePoint: true,

  snapArray: [0, 1, 2, 2.5, 4, 5, 10],
  // 指定固定 tick 数的逼近值
  snapCountArray: [0, 1, 1.2, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10],
  // animate: false,
  // colors: {
  //   'default': COLORS
  // },
  shape: {
    line: {
      lineWidth: 2
    },
    area: {
      fillOpacity: 0.1
    },
    interval: {
      fillOpacity: 1
    },
  },
  axis: {
    bottom: {
      label: {
        offset: 18,
        autoRotate: false,
        textStyle: { fill: color.widgetsAxisLabel } // 底部标签文本的颜色
      },
      line: {
        stroke: color.widgetsAxisLine
      },
      tickLine: null
    },
    left: {
      label: {
        offset: 8,
        textStyle: { fill: color.widgetsAxisLabel } // 左部标签文本的颜色
      },
      grid: {
        // 让grid在轴线的下方
        zIndex: -1,
        lineStyle: {
          stroke: color.widgetsAxisGrid,
          lineWidth: 1,
          lineDash: null
        },
      }
    },
    right: {
      label: {
        offset: 8,
        textStyle: { fill: color.widgetsAxisLabel } // 右部标签文本的颜色
      }
    }
  },
  tooltip: {
    offset: 8,
    crossLine: {
      stroke: color['widgets-tooltip-cross-line'],
      // lineWidth: 1,
    },
    'g2-tooltip': {
      backgroundColor: color['widgets-tooltip-background'],
      boxShadow: color['widgets-tooltip-shadow'],
      padding: size.s3,
      borderRadius: size.s1,
      fontFamily: fonts.fontFamilyBase,
      fontSize: fonts.fontSizeBaseCaption,
      lineHeight: fonts.fontSizeBaseCaption,
      color: color.widgetsTooltipText,
      textAlign: 'left',
    },
    'g2-tooltip-title': {
      marginBottom: 0,
      color: color.widgetsTooltipTitle
    },
    'g2-tooltip-list': {},
    'g2-tooltip-list-item': {
      marginBottom: 0,
      marginTop: size.s2,
      listStyle: 'none'
    },
    'g2-tooltip-marker': {
      width: '6px',
      height: '6px',
      border: 'none',
      marginRight: size.s1,
    },
  },
  tooltipMarker: {
    symbol: (x, y, r, ctx, marker) => {
      ctx.fillStyle = color.widgetsTooltipMarkerFill;
      ctx.lineWidth = 2;
      ctx.strokeStyle = marker.get('color');
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.stroke();
    },
    // 这里必须传数字，所以不能直接引用
    radius: 4
  },
  tooltipCrosshairsRect: {
    style: {
      fill: color['widgets-tooltip-cross-react'],
      opacity: color['widgets-tooltip-cross-react-opacity']
    }
  },
  tooltipCrosshairsLine: {
    style: {
      stroke: color.colorN17,
      lineWidth: 1
    }
  },
  legend: {
    top: {
      textStyle: {
        fill: color.widgetsLegendText
      },
      unCheckColor: color.widgetsLegendUncheck
    },
    right: {
      textStyle: {
        fill: color.widgetsLegendText
      },
      unCheckColor: color.widgetsLegendUncheck
    },
    bottom: {
      textStyle: {
        fill: color.widgetsLegendText
      },
      unCheckColor: color.widgetsLegendUncheck
    },
    left: {
      textStyle: {
        fill: color.widgetsLegendText
      },
      unCheckColor: color.widgetsLegendUncheck
    },
    html: {
      // 注意！ 这个需要和 wmap 中的 G2Map.scss .aisc-widgets-map-legend 的样式一致
      'g2-legend': {
        overflow: 'auto',
        fontFamily: fonts.fontFamilyBase,
        fontSize: fonts.fontSizeBaseCaption,
        lineHeight: fonts.fontSizeBaseCaption,
        color: color.widgetsLegendText
      },
      'g2-legend-list': {},
      'g2-legend-list-item': {
        wordBreak: 'break-all',
        marginBottom: size.s3,
        marginRight: size.s3
      },
      'g2-legend-marker': {
        width: '6px',
        height: '6px',
        marginRight: size.s1,
        verticalAlign: '1px'
      },
    }
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
          fontSize: fonts.fontSizeBaseCaption,
          fontFamily: fonts.fontFamilyBase,
        }
      }
    },
    region: {
      style: {
        fill: color.colorB16, // 辅助框填充的颜色
        fillOpacity: 0.1 // 辅助框的背景透明度
      } // 辅助框的图形样式属性
    },
  }
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

