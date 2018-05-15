'use strict';

import G2 from '@antv/g2';
import React from 'react';
import PropTypes from 'prop-types';
import { size, color, fonts } from '../theme/normal';
import { getParentSize, requestAnimationFrame } from './common';
import highchartsDataToG2Data from './dataAdapter';

//全局G2主题设置
const theme = G2.Util.deepMix({}, G2.Global, {
  // 线图只有一个数据时显示点
  showSinglePoint: true,

  snapArray: [ 0, 1, 2, 2.5, 4, 5, 10 ],
  // 指定固定 tick 数的逼近值
  snapCountArray: [ 0, 1, 1.2, 1.5, 1.6, 2, 2.2, 2.4, 2.5, 3, 4, 5, 6, 7.5, 8, 10 ],
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
        textStyle: { fill: color.colorN22} // 底部标签文本的颜色
      },
      line: {
        stroke: color.colorN16
      },
      tickLine: null
    },
    left: {
      label: {
        offset: 8,
        textStyle: { fill: color.colorN22} // 左部标签文本的颜色
      },
      grid: {
        // 让grid在轴线的下方
        zIndex: -1,
        lineStyle: {
          stroke: color.colorN13,
          lineWidth: 1,
          lineDash: null
        },
      }
    },
    right: {
      label: {
        offset: 8,
        textStyle: { fill: color.colorN22} // 右部标签文本的颜色
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
      color: color.colorN24,
      textAlign: 'left',
    },
    'g2-tooltip-title': {
      marginBottom: 0,
      color: color.colorN22
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
      ctx.fillStyle = color.colorWhite;
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
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    right: {
      textStyle: {
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    bottom: {
      textStyle: {
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    left: {
      textStyle: {
        fill: color.colorN24
      },
      unCheckColor: color.colorN21
    },
    html: {
      // 注意！ 这个需要和 wmap 中的 G2Map.scss .aisc-widgets-map-legend 的样式一致
      'g2-legend': {
        overflow: 'auto',
        fontFamily: fonts.fontFamilyBase,
        fontSize: fonts.fontSizeBaseCaption,
        lineHeight: fonts.fontSizeBaseCaption,
        color: color.colorN24
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
});
//设置屏幕dpi缩放（如果有效的话）
if (window && window.devicePixelRatio) {
  theme.pixelRatio = window.devicePixelRatio;
}
G2.Global.setTheme(theme); // 将主题设置为用户自定义的主题

// 图表唯一id
let uniqueId = 0;
function generateUniqueId() {
  return `react-g2-${uniqueId++}`;
}

const rootClassName = 'aisc-widgets ';
const rootChildClassName = 'aisc-widgets-children';

/**
 * g2Factory 函数
 * 将非React版的图表类转化为React版
 *
 * @param {string} name 组件名称
 * @param Chart 组件原生代码组
 * @param {boolean} convertData 控制是否转化数据
 * */
function g2Factory(name, Chart, convertData = true) {
  let ChartProcess = Chart;
  class AiscChart extends React.Component {
    static propTypes = {
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      config: PropTypes.object,
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.object),
        PropTypes.object
      ]).isRequired,
      event: PropTypes.object,
      forceFit: PropTypes.bool
    };

    static defaultProps = {
      //forceFit: false,
      config: {},
    };

    static isG2Chart = true;

    constructor(props, context) {
      super(props, context);
      this.chart = null;
      this.chartDom = null;
      this.chartId = generateUniqueId();

      this.autoResize = this.autoResize.bind(this);
    }

    componentWillMount () {
      if (this.props.customChart) {
        this.chartProcess = ChartProcess = Object.assign({}, ChartProcess, this.props.customChart);
      } else {
        this.chartProcess = ChartProcess;
      }
    }

    componentDidMount () {
      // 设置初始高宽
      this.initSize();

      // 开始初始化图表
      const props = ChartProcess.beforeInit ? ChartProcess.beforeInit.call(this, this.props) : this.props;
      const { width = this._size[0], height = (this._size[1] || 200), data: initData, padding, forceFit, config, event, ...otherProps } = props;
      const chart = new G2.Chart({
        container: this.chartDom,
        width,
        height,
        padding,
        forceFit: forceFit || false,
        ...otherProps
      });
      const data = convertData ? (config.dataType === 'g2' ? initData : highchartsDataToG2Data(initData, config)) : initData;
      if (config.xAxis && config.xAxis.type === 'datetime') {
        console.warn('配置属性 "config.xAxis.type": "datetime" 在 widgets 2.x 中已被废弃，请使用 "config.xAxis.type": "time"。详情请看：http://aisc.alibaba-inc.com/site/pc#/cate/4/page/137。');
      }
      this.rawData = initData;
      chart && ChartProcess.init.call(this, chart, config, data, initData);

      if (chart && event) {
        Object.keys(event).forEach((eventKey) => {
          chart.on(eventKey, event[eventKey]);
        });
      }

      this.chart = chart;
    }

    componentWillReceiveProps(nextProps){
      const { data: newData, width: newWidth, height: newHeight, padding: newPadding, config: newConfig } = nextProps;
      const { data: oldData, width: oldWidth, height: oldHeight, padding: oldPadding } = this.props;

      if (newPadding !== oldPadding) {
        console.warn('padding 不支持修改');
      }

      if (newData !== oldData || (Array.isArray(newData) && Array.isArray(oldData) && newData.length !== oldData.length)) {
        const data = convertData ? (newConfig.dataType === 'g2' ? newData : highchartsDataToG2Data(newData, newConfig)) : newData;
        this.rawData = newData;
        if (ChartProcess.changeData) {
          this.chart && ChartProcess.changeData.call(this, this.chart, newConfig, data);
        } else {
          this.chart && this.chart.changeData(data);
        }
      }
      if (newWidth !== oldWidth || newHeight !== oldHeight) {
        if (ChartProcess.changeSize) {
          this.chart && ChartProcess.changeSize.call(this, this.chart, newConfig, newWidth, newHeight);
        } else {
          this.chart && this.chart.changeSize(newWidth, newHeight);
        }
      }
    }

    shouldComponentUpdate (nextProps) {
      const { className: newClass, style: newStyle, children: newChild } = nextProps;
      const { className: oldClass, style: oldStyle, children: oldChild } = this.props;
      return newClass !== oldClass || newStyle !== oldStyle || newChild !== oldChild;
    }

    // componentWillUpdate (nextProps) {}

    componentWillUnmount () {
      window.removeEventListener('resize', this.autoResize);

      if (ChartProcess.destroy) {
        this.chart && ChartProcess.destroy.call(this, this.chart);
      }

      this.chart && this.chart.off();
      this.chart && this.chart.destroy && this.chart.destroy();
      this.chart = null;
      this.chartDom = null;
      this.chartId = null;
    }

    initSize() {
      const element = this.chartDom;
      const parentSize = getParentSize(element, this.props.width, this.props.height);
      this.setSize(parentSize);

      window.addEventListener('resize', this.autoResize);
    }

    resizeRuning = false;
    autoResize() {
      if (this.resizeRuning) {
        return;
      }

      const { chartDom: element, props, _size } = this;
      this.resizeRuning = true;

      requestAnimationFrame(() => {
        this.resizeRuning = false;

        const parentSize = getParentSize(element, props.width, props.height);
        if(!(parentSize[0] === _size[0] && parentSize[1] === _size[1])){
          this.setSize(parentSize);

          if (ChartProcess.changeSize) {
            this.chart && ChartProcess.changeSize.call(this, this.chart, props.config, parentSize[0], parentSize[1]);
          } else {
            this.chart && this.chart.changeSize(parentSize[0], parentSize[1]);
          }
        }
      })
    }

    setSize(newSize) {
      const element = this.chartDom;
      this._size = newSize;

      if (newSize[0]) {
        element.style.width = newSize[0] + 'px';
      }
      if (newSize[1]) {
        element.style.height = newSize[1] + 'px';
      }
    }

    render() {
      const { className = '', style, children, data, width, height, padding, config, ...otherProps } = this.props;
      return (
        <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + name + ' ' + className} style={style} {...otherProps}>
          {children ? <div className={rootChildClassName}>{children}</div> : null}
        </div>
      );
    }
  }

  //暴露原版类
  AiscChart.Chart = Chart;

  AiscChart.displayName = 'AiscWidgets' + name;

  return AiscChart;
}

export default g2Factory;
