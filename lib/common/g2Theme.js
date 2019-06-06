'use strict';

exports.__esModule = true;
exports.legendTextStyle = exports.legendHtmlMarker = exports.legendHtmlListItem = exports.legendHtmlList = exports.legendHtmlContainer = undefined;
exports.default = setG2Theme;

var _index = require('../theme/index');

var _index2 = _interopRequireDefault(_index);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var legendHtmlContainer = exports.legendHtmlContainer = {
  overflow: 'auto',
  fontFamily: _index2.default['widgets-font-family-txd-m-number'],
  fontSize: _index2.default['widgets-font-size-1'],
  lineHeight: 1,
  color: _index2.default['widgets-legend-text']
};
var legendHtmlList = exports.legendHtmlList = {
  textAlign: ''
};
var legendHtmlListItem = exports.legendHtmlListItem = {
  wordBreak: 'break-all',
  marginTop: 0,
  marginBottom: _index2.default.s3,
  marginRight: _index2.default.s3
};
var legendHtmlMarker = exports.legendHtmlMarker = {
  width: '6px',
  height: '6px',
  marginRight: _index2.default.s1,
  verticalAlign: '1px'
};

var legendTextStyle = exports.legendTextStyle = {
  fill: _index2.default['widgets-legend-text'],
  fontSize: _index2.default['widgets-font-size-1']
};

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
      fill: _index2.default['widgets-label-text'],
      fontSize: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
      fontFamily: _index2.default['widgets-font-family-txd-r-number']
    }
  },
  innerLabels: {
    textStyle: {
      fill: _index2.default['widgets-label-text'],
      fontSize: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
      fontFamily: _index2.default['widgets-font-family-txd-r-number']
    }
  },
  axis: {
    bottom: {
      title: {
        textStyle: {
          fontSize: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        }
      },
      label: {
        offset: 18,
        autoRotate: false,
        textStyle: {
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        } // 底部标签文本的颜色
      },
      line: {
        stroke: _index2.default['widgets-axis-line']
      },
      tickLine: null
    },
    left: {
      title: {
        textStyle: {
          fontSize: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        }
      },
      label: {
        offset: 8,
        textStyle: {
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        } // 左部标签文本的颜色
      },
      grid: {
        // 让grid在轴线的下方
        zIndex: -1,
        lineStyle: {
          stroke: _index2.default['widgets-axis-grid'],
          lineWidth: 1,
          lineDash: null
        },
        zeroLineStyle: {
          stroke: _index2.default['widgets-axis-line']
        }
      }
    },
    right: {
      title: {
        textStyle: {
          fontSize: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        }
      },
      label: {
        offset: 8,
        textStyle: {
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        } // 右部标签文本的颜色
      }
    },
    circle: {
      label: {
        offset: 8,
        textStyle: {
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        } // 底部标签文本的颜色
      },
      line: {
        stroke: _index2.default['widgets-axis-line']
      },
      tickLine: null,
      grid: {
        lineStyle: {
          stroke: _index2.default['widgets-axis-line']
        }
      }
    },
    radius: {
      label: {
        offset: 8,
        textStyle: {
          fill: _index2.default['widgets-axis-label'],
          fontFamily: _index2.default['widgets-font-family-txd-r-number']
        } // 底部标签文本的颜色
      },
      line: {
        stroke: _index2.default['widgets-axis-line']
      },
      tickLine: null,
      grid: {
        lineStyle: {
          stroke: _index2.default['widgets-axis-line']
        }
      }
    }
  },
  tooltip: {
    offset: 8,
    crossLine: {
      stroke: _index2.default['widgets-tooltip-cross-line']
      // lineWidth: 1,
    },
    'g2-tooltip': {
      backgroundColor: _index2.default['widgets-tooltip-background'],
      boxShadow: _index2.default['widgets-tooltip-shadow'],
      padding: _index2.default.s3,
      borderRadius: _index2.default.s1,
      fontFamily: _index2.default['widgets-font-family-txd-m-number'],
      fontSize: _index2.default['widgets-font-size-1'],
      lineHeight: 1,
      color: _index2.default['widgets-tooltip-text'],
      textAlign: 'left'
    },
    'g2-tooltip-title': {
      marginBottom: 0,
      color: _index2.default['widgets-tooltip-title']
    },
    'g2-tooltip-list': {},
    'g2-tooltip-list-item': {
      marginBottom: 0,
      marginTop: _index2.default.s2,
      listStyle: 'none'
    },
    'g2-tooltip-marker': {
      width: '6px',
      height: '6px',
      border: 'none',
      marginRight: _index2.default.s1
    },
    // 如果修改了 tooltip.itemTpl 这里的调整会无效
    'g2-tooltip-value': {
      marginLeft: _index2.default.s2
    }
  },
  tooltipMarker: {
    stroke: _index2.default['widgets-tooltip-marker-fill'],
    // 如果要让 shadowColor 显示为对应数据颜色，需要 delete G2.Global.tooltipMarker.shadowColor;
    radius: 4
    // lineWidth: 2,
  },
  tooltipCrosshairsRect: {
    style: {
      fill: _index2.default['widgets-tooltip-cross-react'],
      opacity: _index2.default['widgets-tooltip-cross-react-opacity']
    }
  },
  tooltipCrosshairsLine: {
    style: {
      stroke: _index2.default['widgets-tooltip-cross-line'],
      lineWidth: 1
    }
  },
  legend: {
    top: {
      textStyle: {
        fill: _index2.default['widgets-legend-text']
      },
      unCheckColor: _index2.default['widgets-legend-uncheck']
    },
    right: {
      textStyle: {
        fill: _index2.default['widgets-legend-text']
      },
      unCheckColor: _index2.default['widgets-legend-uncheck']
    },
    bottom: {
      textStyle: {
        fill: _index2.default['widgets-legend-text']
      },
      unCheckColor: _index2.default['widgets-legend-uncheck']
    },
    left: {
      textStyle: {
        fill: _index2.default['widgets-legend-text']
      },
      unCheckColor: _index2.default['widgets-legend-uncheck']
    },
    html: {
      // 注意！ 这个需要和 wmap 中的 G2Map.scss .aisc-widgets-map-legend 的样式一致
      'g2-legend': legendHtmlContainer,
      'g2-legend-list': legendHtmlList,
      'g2-legend-list-item': legendHtmlListItem,
      'g2-legend-marker': legendHtmlMarker
    }
  },
  guide: {
    line: {
      lineStyle: {
        stroke: _index2.default['color-b1-6']
      },
      text: {
        autoRotate: false,
        style: {
          fill: _index2.default['color-b1-6'],
          fontSize: (0, _common.pxToNumber)(_index2.default['widgets-font-size-1']),
          fontFamily: _index2.default['widgets-font-family-txd-m-number']
        }
      }
    },
    region: {
      style: {
        fill: _index2.default['color-b1-6'], // 辅助框填充的颜色
        fillOpacity: 0.1 // 辅助框的背景透明度
      } // 辅助框的图形样式属性
    }
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