'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setG2Theme;

var _index = require('../theme/index');

var _common = require('./common');

var widgetsTheme = {
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
      lineWidth: 2
    },
    area: {
      fillOpacity: 0.1
    },
    interval: {
      fillOpacity: 1
    }
  },
  label: {
    textStyle: {
      fill: _index.color.widgetsLabelText
    }
  },
  innerLabels: {
    textStyle: {
      fill: _index.color.widgetsLabelText
    }
  },
  axis: {
    bottom: {
      label: {
        offset: 18,
        autoRotate: false,
        textStyle: { fill: _index.color.widgetsAxisLabel // 底部标签文本的颜色
        } },
      line: {
        stroke: _index.color.widgetsAxisLine
      },
      tickLine: null
    },
    left: {
      label: {
        offset: 8,
        textStyle: { fill: _index.color.widgetsAxisLabel // 左部标签文本的颜色
        } },
      grid: {
        // 让grid在轴线的下方
        zIndex: -1,
        lineStyle: {
          stroke: _index.color.widgetsAxisGrid,
          lineWidth: 1,
          lineDash: null
        },
        zeroLineStyle: {
          stroke: _index.color.widgetsAxisLine
        }
      }
    },
    right: {
      label: {
        offset: 8,
        textStyle: { fill: _index.color.widgetsAxisLabel // 右部标签文本的颜色
        } }
    },
    circle: {
      label: {
        offset: 8,
        textStyle: { fill: _index.color.widgetsAxisLabel // 底部标签文本的颜色
        } },
      line: {
        stroke: _index.color.widgetsAxisLine
      },
      tickLine: null,
      grid: {
        lineStyle: {
          stroke: _index.color.widgetsAxisLine
        }
      }
    },
    radius: {
      label: {
        offset: 8,
        textStyle: { fill: _index.color.widgetsAxisLabel // 底部标签文本的颜色
        } },
      line: {
        stroke: _index.color.widgetsAxisLine
      },
      tickLine: null,
      grid: {
        lineStyle: {
          stroke: _index.color.widgetsAxisLine
        }
      }
    }
  },
  tooltip: {
    offset: 8,
    crossLine: {
      stroke: _index.color.widgetsTooltipCrossLine
      // lineWidth: 1,
    },
    'g2-tooltip': {
      backgroundColor: _index.color.widgetsTooltipBackground,
      boxShadow: _index.color.widgetsTooltipShadow,
      padding: _index.size.s3,
      borderRadius: _index.size.s1,
      fontFamily: _index.fonts.fontFamilyBase,
      fontSize: _index.fonts.fontSizeBaseCaption,
      lineHeight: _index.fonts.fontSizeBaseCaption,
      color: _index.color.widgetsTooltipText,
      textAlign: 'left'
    },
    'g2-tooltip-title': {
      marginBottom: 0,
      color: _index.color.widgetsTooltipTitle
    },
    'g2-tooltip-list': {},
    'g2-tooltip-list-item': {
      marginBottom: 0,
      marginTop: _index.size.s2,
      listStyle: 'none'
    },
    'g2-tooltip-marker': {
      width: '6px',
      height: '6px',
      border: 'none',
      marginRight: _index.size.s1
    }
  },
  tooltipMarker: {
    symbol: function symbol(x, y, r, ctx, marker) {
      ctx.fillStyle = _index.color.widgetsTooltipMarkerFill;
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
      fill: _index.color.widgetsTooltipCrossReact,
      opacity: _index.color.widgetsTooltipCrossReactOpacity
    }
  },
  tooltipCrosshairsLine: {
    style: {
      stroke: _index.color.widgetsTooltipCrossLine,
      lineWidth: 1
    }
  },
  legend: {
    top: {
      textStyle: {
        fill: _index.color.widgetsLegendText
      },
      unCheckColor: _index.color.widgetsLegendUncheck
    },
    right: {
      textStyle: {
        fill: _index.color.widgetsLegendText
      },
      unCheckColor: _index.color.widgetsLegendUncheck
    },
    bottom: {
      textStyle: {
        fill: _index.color.widgetsLegendText
      },
      unCheckColor: _index.color.widgetsLegendUncheck
    },
    left: {
      textStyle: {
        fill: _index.color.widgetsLegendText
      },
      unCheckColor: _index.color.widgetsLegendUncheck
    },
    html: {
      // 注意！ 这个需要和 wmap 中的 G2Map.scss .aisc-widgets-map-legend 的样式一致
      'g2-legend': {
        overflow: 'auto',
        fontFamily: _index.fonts.fontFamilyBase,
        fontSize: _index.fonts.fontSizeBaseCaption,
        lineHeight: _index.fonts.fontSizeBaseCaption,
        color: _index.color.widgetsLegendText
      },
      'g2-legend-list': {},
      'g2-legend-list-item': {
        wordBreak: 'break-all',
        marginTop: 0,
        marginBottom: _index.size.s3,
        marginRight: _index.size.s3
      },
      'g2-legend-marker': {
        width: '6px',
        height: '6px',
        marginRight: _index.size.s1,
        verticalAlign: '1px'
      }
    }
  },
  guide: {
    line: {
      lineStyle: {
        stroke: _index.color.colorB16
      },
      text: {
        autoRotate: false,
        style: {
          fill: _index.color.colorB16,
          fontSize: _index.fonts.fontSizeBaseCaption,
          fontFamily: _index.fonts.fontFamilyBase
        }
      }
    },
    region: {
      style: {
        fill: _index.color.colorB16, // 辅助框填充的颜色
        fillOpacity: 0.1 // 辅助框的背景透明度
        // 辅助框的图形样式属性
      } }
  }
};

// 设置全局G2主题
function setG2Theme(G2) {
  var theme = G2.Util.deepMix({}, G2.Global, widgetsTheme);

  // 设置屏幕dpi缩放（如果有效的话）
  if (window && window.devicePixelRatio) {
    theme.pixelRatio = window.devicePixelRatio;
  }

  // 将主题设置为自定义的主题
  G2.Global.setTheme(theme);
}
module.exports = exports['default'];