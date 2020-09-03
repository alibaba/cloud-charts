import * as React from "react";

type BaseProps = {
  propTypes?: React.ReactPropTypes;
  defaultProps?: any;
  forwardedRef?: React.Ref<any>
}

interface ChartInstance {
  chart: any;
  chartId: string;
  chartDom: HTMLDivElement;
  _size: number[];
}

/**
 * 快速生成图表组件的工厂函数
 * @param {React.Component} Chart 用于渲染的图表组件
 * @param {string} name 组件名称
 * @param {Object} defaultConfig 默认配置项
 *
 * @return {React.Component} 包装后的组件
 * */
export default function factory(Chart: React.ComponentClass<any, any>, name: string, defaultConfig: object) {
  class ConsoleChartsBase extends React.PureComponent<BaseProps> {
    static displayName: string = name;

    public chart: any;
    public chartId: string;
    public chartDom: HTMLDivElement;
    public _size: number[];

    // 低版本React中，复制可能用到的属性。
    oldReactRef = (chartInstance: ChartInstance) => {
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
    const forwardRefFunc = function (props: React.PropsWithoutRef<any>, ref: React.Ref<any>) {
      return <ConsoleChartsBase {...props} forwardedRef={ref} />;
    };
    const result = React.forwardRef(forwardRefFunc);
    result.displayName = name;

    return result;
  }

  return ConsoleChartsBase;
}
