'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import G2 from '@antv/g2';

import { pxToNumber } from './common';

export var legendHtmlContainer = {};
function getLegendHtmlContainer(themes) {
  return {
    overflow: 'auto',
    fontFamily: themes['widgets-font-family-txd-m-number'],
    fontSize: themes['widgets-font-size-1'],
    lineHeight: 1,
    color: themes['widgets-legend-text']
  };
}

export var legendHtmlList = {};
function getLegendHtmlList(themes) {
  return {
    textAlign: ''
  };
}

export var legendHtmlListItem = {};
function getLegendHtmlListItem(themes) {
  return {
    wordBreak: 'break-all',
    marginTop: 0,
    marginBottom: themes['widgets-font-size-1'],
    marginRight: themes['widgets-font-size-1']
  };
}

export var legendHtmlMarker = {};
function getLegendHtmlMarker(themes) {
  var fontSize1 = pxToNumber(themes['widgets-font-size-1']);
  return {
    width: fontSize1 / 2 + 'px',
    height: fontSize1 / 2 + 'px',
    marginRight: fontSize1 / 3 + 'px',
    verticalAlign: '1px'
  };
}

export var legendTextStyle = {};
function getLegendTextStyle(themes) {
  return {
    fill: themes['widgets-legend-text'],
    fontSize: themes['widgets-font-size-1']
  };
}

function getG2ThemeConfig(themes) {
  var fontSize1 = pxToNumber(themes['widgets-font-size-1']);

  return {
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
        fillOpacity: themes['widgets-shape-area-opacity']
      },
      interval: {
        fillOpacity: themes['widgets-shape-interval-opacity']
      }
    },
    label: {
      textStyle: {
        fill: themes['widgets-label-text'],
        fontSize: fontSize1,
        fontFamily: themes['widgets-font-family-txd-r-number']
      }
    },
    innerLabels: {
      textStyle: {
        fill: themes['widgets-label-text'],
        fontSize: fontSize1,
        fontFamily: themes['widgets-font-family-txd-r-number']
      }
    },
    axis: {
      bottom: {
        title: {
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          }
        },
        label: {
          offset: fontSize1 * 1.5,
          autoRotate: false,
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          } // 底部标签文本的颜色
        },
        line: {
          stroke: themes['widgets-axis-line']
        },
        tickLine: null
      },
      left: {
        title: {
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          }
        },
        label: {
          offset: fontSize1 * 2 / 3,
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          } // 左部标签文本的颜色
        },
        grid: {
          // 让grid在轴线的下方
          zIndex: -1,
          lineStyle: {
            stroke: themes['widgets-axis-grid'],
            lineWidth: 1,
            lineDash: null
          },
          zeroLineStyle: {
            stroke: themes['widgets-axis-line']
          }
        }
      },
      right: {
        title: {
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          }
        },
        label: {
          offset: fontSize1 * 2 / 3,
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          } // 右部标签文本的颜色
        }
      },
      circle: {
        label: {
          offset: fontSize1 * 2 / 3,
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          } // 底部标签文本的颜色
        },
        line: {
          stroke: themes['widgets-axis-line']
        },
        tickLine: null,
        grid: {
          lineStyle: {
            stroke: themes['widgets-axis-line']
          }
        }
      },
      radius: {
        label: {
          offset: fontSize1 * 2 / 3,
          textStyle: {
            fontSize: fontSize1,
            fill: themes['widgets-axis-label'],
            fontFamily: themes['widgets-font-family-txd-r-number']
          } // 底部标签文本的颜色
        },
        line: {
          stroke: themes['widgets-axis-line']
        },
        tickLine: null,
        grid: {
          lineStyle: {
            stroke: themes['widgets-axis-line']
          }
        }
      }
    },
    tooltip: {
      offset: 8,
      crossLine: {
        stroke: themes['widgets-tooltip-cross-line']
        // lineWidth: 1,
      },
      'g2-tooltip': {
        backgroundColor: themes['widgets-tooltip-background'],
        boxShadow: themes['widgets-tooltip-shadow'],
        padding: themes['widgets-font-size-1'],
        borderRadius: themes.s1,
        fontFamily: themes['widgets-font-family-txd-m-number'],
        fontSize: themes['widgets-font-size-1'],
        lineHeight: 1,
        color: themes['widgets-tooltip-text'],
        textAlign: 'left'
      },
      'g2-tooltip-title': {
        marginBottom: 0,
        color: themes['widgets-tooltip-title']
      },
      'g2-tooltip-list': {},
      'g2-tooltip-list-item': {
        marginBottom: 0,
        marginTop: themes.s2,
        listStyle: 'none'
      },
      'g2-tooltip-marker': {
        width: fontSize1 / 2 + 'px',
        height: fontSize1 / 2 + 'px',
        border: 'none',
        marginRight: fontSize1 / 3 + 'px'
      },
      // 如果修改了 tooltip.itemTpl 这里的调整会无效
      'g2-tooltip-value': {
        marginLeft: fontSize1 * 2 / 3 + 'px'
      }
    },
    tooltipMarker: {
      stroke: themes['widgets-tooltip-marker-fill'],
      // 如果要让 shadowColor 显示为对应数据颜色，需要 delete G2.Global.tooltipMarker.shadowColor;
      radius: 4
      // lineWidth: 2,
    },
    tooltipCrosshairsRect: {
      style: {
        fill: themes['widgets-tooltip-cross-react'],
        opacity: themes['widgets-tooltip-cross-react-opacity']
      }
    },
    tooltipCrosshairsLine: {
      style: {
        stroke: themes['widgets-tooltip-cross-line'],
        lineWidth: 1
      }
    },
    legend: {
      top: {
        textStyle: {
          fill: themes['widgets-legend-text']
        },
        unCheckColor: themes['widgets-legend-uncheck']
      },
      right: {
        textStyle: {
          fill: themes['widgets-legend-text']
        },
        unCheckColor: themes['widgets-legend-uncheck']
      },
      bottom: {
        textStyle: {
          fill: themes['widgets-legend-text']
        },
        unCheckColor: themes['widgets-legend-uncheck']
      },
      left: {
        textStyle: {
          fill: themes['widgets-legend-text']
        },
        unCheckColor: themes['widgets-legend-uncheck']
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
          stroke: themes['widgets-color-blue']
        },
        text: {
          autoRotate: false,
          style: {
            fill: themes['widgets-color-blue'],
            fontSize: fontSize1,
            fontFamily: themes['widgets-font-family-txd-m-number']
          }
        }
      },
      region: {
        style: {
          fill: themes['widgets-color-blue'], // 辅助框填充的颜色
          fillOpacity: themes['widgets-guide-region-opacity'] // 辅助框的背景透明度
        } // 辅助框的图形样式属性
      },
      text: {
        style: {
          fill: themes['widgets-color-blue'],
          fontSize: fontSize1,
          fontFamily: themes['widgets-font-family-txd-m-number']
        }
      }
    }
  };
}

// 设置全局G2主题
export default function setG2Theme(themes) {
  _extends(legendHtmlContainer, getLegendHtmlContainer(themes));
  _extends(legendHtmlList, getLegendHtmlList(themes));
  _extends(legendHtmlListItem, getLegendHtmlListItem(themes));
  _extends(legendHtmlMarker, getLegendHtmlMarker(themes));
  _extends(legendTextStyle, getLegendTextStyle(themes));

  var theme = G2.Util.deepMix({}, G2.Global, getG2ThemeConfig(themes));

  // 设置屏幕dpi缩放（如果有效的话）
  if (window && window.devicePixelRatio) {
    theme.pixelRatio = window.devicePixelRatio;
  }

  // 将主题设置为自定义的主题
  G2.Global.setTheme(theme);
}