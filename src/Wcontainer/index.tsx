'use strict';

import * as React from 'react';
import classNames from 'classnames';
import Divider from './views/divider';
import chartLog from "../common/log";
import { isMobileWithProps, MobileProps } from '../common/platform';
import { FullCrossName, PrefixName } from '../constants';
import './index.scss';

const prefix = `${PrefixName}-wcontainer`;

interface WcontainerProps extends MobileProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  arrange?: 'normal' | 'cross';
  title?: React.ReactNode;
  titleBorder?: boolean;
  operation?: React.ReactNode;
  titleStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  fullContent?: boolean;

  catchError?: boolean;
  onError?(error: Error, info: React.ErrorInfo): boolean | void;
}

interface WcontainerState {
  criticalError?: Error;
}

export default class Wcontainer extends React.Component<WcontainerProps, WcontainerState> {
  static displayName = 'Wcontainer';

  static defaultProps = {
    arrange: 'normal',
    height: '100%',
    operation: '',
    titleBorder: true,
    catchError: true,
  };

  static divider = Divider;

  static combiner = 'combiner';

  constructor(props: WcontainerProps) {
    super(props);
    this.state = { criticalError: null };

    // 图表初始化时记录日志
    chartLog('Wcontainer', 'init');

    if (props.catchError) {
      this.componentDidCatch = (error, info) => {
        const { onError } = this.props;
        let customError = null;
        if (onError) {
          customError = onError(error, info);
        }
        if (customError !== false) {
          this.setState({ criticalError: error });
        }
      };
    }
  }

  renderTitle(title: React.ReactNode, titleBorder: boolean, operation: React.ReactNode, titleStyle: React.CSSProperties) {
    const titleBorderCls = titleBorder ? `${prefix}-title-border` : '';
    return (
      <div className={`${prefix}-title ${titleBorderCls}`} style={titleStyle}>
        {title}
        {
          operation ?
            <div className={`${prefix}-operation`}>
              {operation}
            </div> : null
        }
      </div>
    );
  }

  renderMainNormal(contentStyle: React.CSSProperties, fullContent: boolean) {
    const { children: propsChildren, title } = this.props;

    const oneChild = React.Children.count(propsChildren) === 1;
    // @ts-ignore
    if ((oneChild && propsChildren && propsChildren.type && propsChildren.type.isG2Chart) || fullContent) {
      return (
        <div className={`${prefix}-main ${prefix}-main-one-chart ${title ? '' : 'no-title'}`} style={contentStyle}>
          {propsChildren}
        </div>
      );
    }

    return (
      <div className={`${prefix}-main ${title ? '' : 'no-title'}`} style={contentStyle}>
        <div className={`${prefix}-row ${prefix}-row-no-padding ${prefix}-row-align-center`}>
          {React.Children.map(propsChildren, (child, i) => {
            if (!child) {
              return child;
            }
            if (oneChild) {
              return (
                <div className={`${prefix}-col ${prefix}-col-24`} key={i}>
                  {child}
                </div>
              );
            }
            // @ts-ignore
            if (child.type.displayName === 'Wicon' || child.type.displayName === 'Wcircle') {
              return (
                <div className={`${prefix}-col ${prefix}-col-fixed-2`} key={i}>
                  {child}
                </div>
              );
            }
            // @ts-ignore
            if (child.type.isG2Chart) {
              return (
                <div className={`${prefix}-col ${prefix}-col-fixed-4`} key={i}>
                  {child}
                </div>
              );
            }
            // @ts-ignore
            if (child.type.displayName === 'Divider') {
              return (
                <div className={`${prefix}-col ${prefix}-col-fixed-1`} key={i}>
                  {child}
                </div>
              );
            }
            return <div className={`${prefix}-col`} key={i}>{child}</div>;
          })}
        </div>
      </div>
    );
  }

  renderMainCross(contentStyle: React.CSSProperties) {
    let maxColPerRow = 0;
    let currentColPerRow = 0;
    // 计算栅格的ColSpan
    React.Children.forEach(this.props.children, (child) => {
      // @ts-ignore
      if (child.type.displayName !== 'Divider') {
        currentColPerRow += 1;
        // @ts-ignore
      } else if (child.type && child.type !== 'combiner') {
        if (currentColPerRow > maxColPerRow) {
          maxColPerRow = currentColPerRow;
        }
        currentColPerRow = 0;
      }
    });
    const ColPerRow = ~~(24 / maxColPerRow);
    return (
      <div className={`${prefix}-main ${prefix}-cross`} style={contentStyle}>
        <div className={`${prefix}-multi-row-container`}>{chunks(this.props.children, ColPerRow)}</div>
      </div>
    );
  }

  renderError() {
    const { title } = this.props;
    const { stack } = this.state.criticalError;

    return (
      <div className={`${prefix}-main ${prefix}-main-critical-error ${title ? '' : 'no-title'}`}>
        <pre>
          {
            stack ? stack : this.state.criticalError.toString()
          }
        </pre>
      </div>
    );
  }

  container: HTMLDivElement;

  render() {
    const { width, height, arrange, title, titleBorder, operation, className, style, titleStyle, contentStyle, fullContent, isMobile, catchError, onError, ...otherProps } = this.props;
    const mainClasses = classNames({
      [FullCrossName]: true,
      [`${prefix}`]: true,
      [`${prefix}-mobile`]: isMobileWithProps(this.props),
      [className]: !!className
    });

    const criticalError = catchError && this.state.criticalError;

    return (
      <div
        className={mainClasses}
        style={{
          width,
          minHeight: height,
          height,
          ...style
        }}
        {...otherProps}
        ref={o => { this.container = o; }}
      >
        {title && this.renderTitle(title, titleBorder, operation, titleStyle)}
        {
          criticalError && this.renderError()
        }
        {!criticalError && arrange === 'normal' && this.renderMainNormal(contentStyle, fullContent)}
        {!criticalError && arrange === 'cross' && this.renderMainCross(contentStyle)}
      </div>
    );
  }
}

function chunks(arr: React.ReactNode, maxSpan: number) {
  const rs: React.ReactElement[] = [];
  let oneRow: React.ReactElement[] = [];
  const len = React.Children.count(arr);
  React.Children.forEach(arr, (child, i) => {
    // @ts-ignore
    if (child.type && child.type.displayName === 'Divider') {
      rs.push(
        <div className={`${prefix}-row ${prefix}-row-across ${prefix}-row-align-center`} key={i}>
          {oneRow}
        </div>
      );
      oneRow = [];
      // @ts-ignore
    } else if (child.type === 'combiner' && oneRow.length) {
      const lastChild = oneRow[oneRow.length - 1].props.children;
      const lastSpan = oneRow[oneRow.length - 1].props.span;
      oneRow[oneRow.length - 1] = (
        <div className={`${prefix}-col ${prefix}-col-${lastSpan + maxSpan}`} key={i}>
          {lastChild}
        </div>
      );
    } else if (i === len - 1) {
      oneRow.push(
        <div className={`${prefix}-col ${prefix}-col-${maxSpan}`} key={i}>
          {child}
        </div>
      );
      rs.push(
        <div className={`${prefix}-row ${prefix}-row-across ${prefix}-row-align-center`} key={i}>
          {oneRow}
        </div>
      );
    } else {
      oneRow.push(
        <div className={`${prefix}-col ${prefix}-col-${maxSpan}`} key={i}>
          {child}
        </div>
      );
    }
  });
  return rs;
}
