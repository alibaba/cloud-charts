import * as React from 'react';
import { BaseChartConfig, Chart } from './types';
import { BaseClass, ChartProps } from './Base';
// import { FullCrossName } from '../constants';
// import Wplaceholder from '../Wplaceholder';
import { getText } from '../ChartProvider';
import themes from '../themes';

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
/*#__PURE__*/ function errorWrap<
  T extends BaseClass<ChartConfig, Props>,
  ChartConfig extends BaseChartConfig,
  Props extends ChartProps<ChartConfig> = ChartProps<ChartConfig>,
>(Component: T): T {
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

    componentDidCatch(error: Error /*, info*/) {
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
        // const { className = '', style, height } = this.props;
        // @ts-ignore
        const { language, locale } = Component.contextType._currentValue;
        // You can render any custom fallback UI
        // return <pre className={`${FullCrossName} widgets-error-info ${className}`} style={style}>{this.state.errorStack}</pre>;
        // return (
        //   <Wplaceholder
        //     error
        //     // locale={{
        //     //   // todo: 国际化
        //     //   error: '图表异常',
        //     // }}
        //     style={{
        //       height: height ? Number(height) : undefined,
        //     }}
        //   />
        // );

        const errorInfo = (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <svg
              width="13.990234375px"
              height="13.990234375px"
              viewBox="0 0 13.990234375 13.990234375"
            >
              <g>
                <path
                  d="M13.2992,4.0833C12.1972,1.5882,9.71352,0.00200162,6.99922,0C5.33879,-0.00111527,3.72987,0.576434,2.44922,1.6333L12.3659,11.55C14.1045,9.4635,14.497,6.5439,13.2992,4.0833ZM11.55,12.3667L1.6333,2.44995C0.576382,3.73057,-0.00117366,5.33951,0,6.99995C0.00200179,9.71425,1.5883,12.198,4.0833,13.3C6.544,14.4978,9.4635,14.1053,11.55,12.3667Z"
                  fillRule="evenodd"
                  fill={themes['widgets-error-svg-color']}
                />
              </g>
            </svg>
            <div style={{ fontSize: 12, color: themes['widgets-color-text-3'], marginLeft: 5 }}>
              {getText('error', this.props?.language || language, locale)}
            </div>
          </div>
        );

        // @ts-ignore
        return <Component {...this.props} errorInfo={errorInfo} />;
      }
      const { forwardedRef = this.oldReactRef, ...rest } = this.props;

      // @ts-ignore 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...(rest as Props)} />;
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
