import * as React from 'react';
import { BaseChartConfig, Chart } from './types';
import { BaseClass, ChartProps } from './Base';
import { FullCrossName } from '../constants';
import Wplaceholder from '../Wplaceholder';

interface ErrorProps {
  forwardedRef?: React.Ref<any>;
}

interface ErrorState {
  errorStack?: string | null;
}

/**
 * errorWrap 错误捕获HOC
 *
 * */
/*#__PURE__*/function errorWrap<T extends BaseClass<ChartConfig, Props>, ChartConfig extends BaseChartConfig, Props extends ChartProps<ChartConfig> = ChartProps<ChartConfig>>(Component: T): T {
  class ErrorBoundary extends React.Component<Props & ErrorProps, ErrorState> {
    static isG2Chart = true;
    static displayName = Component.displayName;
    // static propTypes = Component.propTypes;
    static defaultProps = Component.defaultProps;
    static RawChart = Component;

    state: ErrorState = { errorStack: null };

    public chart: Chart;

    public chartDom: HTMLDivElement;

    public chartId: string;

    public size: number[];

    shouldComponentUpdate() {
      if (this.state.errorStack) {
        // 在update前重置error标记
        // 为顾及React16.3之前的用户，因此没有将该逻辑放在getDerivedStateFromProps里
        this.setState({ errorStack: null });
      }
      return true;
    }

    componentDidCatch(error: Error/*, info*/) {
      // Display fallback UI
      this.setState({ errorStack: error.stack });
    }

    // 低版本React中，复制可能用到的属性。
    oldReactRef: React.RefCallback<any> = (chartInstance) => {
      if (chartInstance) {
        // 复制旧版本可能用到的属性
        this.chart = chartInstance.chart;
        this.chartId = chartInstance.chartId;
        this.chartDom = chartInstance.chartDom;
        this.size = chartInstance.size;
      }
    };

    render() {
      if (this.state.errorStack) {
        const { className = '', style } = this.props;
        // You can render any custom fallback UI
        // return <pre className={`${FullCrossName} widgets-error-info ${className}`} style={style}>{this.state.errorStack}</pre>;
        return <Wplaceholder error children={<div className={`${FullCrossName} widgets-error-info ${className}`} style={style}>{this.state.errorStack}</div>} />
      }
      const { forwardedRef = this.oldReactRef, ...rest } = this.props;

      // @ts-ignore 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return (<Component ref={forwardedRef} {...rest as Props} />);
    }
  }

  if (React.forwardRef) {
    const forwardRefFunc = function (props: any, ref: React.Ref<any>) {
      return <ErrorBoundary {...props} forwardedRef={ref} />;
    };
    const result = React.forwardRef(forwardRefFunc);
    // @ts-ignore
    result.isG2Chart = true;
    // @ts-ignore
    result.RawChart = Component;
    result.displayName = Component.displayName;
    // result.propTypes = Component.propTypes;
    result.defaultProps = Component.defaultProps;

    return result as unknown as T;
  }

  return ErrorBoundary as unknown as T;
}

export default errorWrap;
