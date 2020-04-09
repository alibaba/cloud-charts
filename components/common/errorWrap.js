import React from 'react';

export default /*#__PURE__*/ function errorWrap(Component) {
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
    }

    shouldComponentUpdate() {
      if (this.state.error) {
        // 在update前重置error标记
        // 为顾及React16.3之前的用户，因此没有将该逻辑放在getDerivedStateFromProps里
        this.setState({ error: null });
      }
      return true;
    }

    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ error: error.stack });
    }

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
      if (this.state.error) {
        const { className = '', style } = this.props;
        // You can render any custom fallback UI
        return <pre className={`${Component.baseClassName} widgets-error-info ${className}`} style={style}>{this.state.error}</pre>;
      }
      const { forwardedRef = this.oldReactRef, ...rest } = this.props;

      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  if (React.forwardRef) {
    const forwardRefFunc = function (props, ref) {
      return <ErrorBoundary {...props} forwardedRef={ref} />;
    };
    const result = React.forwardRef(forwardRefFunc);
    result.isG2Chart = true;
    result.displayName = Component.displayName;
    result.propTypes = Component.propTypes;
    result.defaultProps = Component.defaultProps;

    return result;
  }

  ErrorBoundary.isG2Chart = true;
  ErrorBoundary.displayName = Component.displayName;
  ErrorBoundary.propTypes = Component.propTypes;
  ErrorBoundary.defaultProps = Component.defaultProps;

  return ErrorBoundary;
}
