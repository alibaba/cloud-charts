import React from 'react';

/**
 * 快速生成图表组件的工厂函数
 * @param {React.Component} Chart 用于渲染的图表组件
 * @param {string} name 组件名称
 * @param {Object} defaultConfig 默认配置项
 *
 * @return {React.Component} 包装后的组件
 * */
export default function factory(Chart, name, defaultConfig) {
  class ConsoleChartsBase extends React.PureComponent {
    // 低版本React中，复制可能用到的属性。
    oldReactRef = (chartInstance) => {
      if (chartInstance) {
        // 复制旧版本可能用到的属性
        this.chart = chartInstance.chart;
        this.chartId = chartInstance.chartId;
        this.chartDom = chartInstance.chartDom;
        this._size = chartInstance._size;
      }
    };

    render() {
      const { forwardedRef = this.oldReactRef, ...rest } = this.props;
      // 传递 ref
      return <Chart ref={forwardedRef} config={defaultConfig} {...rest} />;
    }
  }

  if (React.forwardRef) {
    const forwardRefFunc = function (props, ref) {
      return <ConsoleChartsBase {...props} forwardedRef={ref} />;
    };
    const result = React.forwardRef(forwardRefFunc);
    result.displayName = name;
    result.propTypes = Chart.propTypes;
    result.defaultProps = Chart.defaultProps;

    return result;
  }

  ConsoleChartsBase.displayName = name;
  ConsoleChartsBase.propTypes = Chart.propTypes;
  ConsoleChartsBase.defaultProps = Chart.defaultProps;

  return ConsoleChartsBase;
}
