'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@alife/aisc/lib/grid/index';

import Divider from './views/divider';
import chartLog from "../common/log";
import { isMobileWithProps } from '../common/platform';
import './index.scss';

const { Row, Col } = Grid;
const prefix = 'aisc-wcontainer';

// const errorText = {
//   'Invalid Time': '',
// };

export default class Wcontainer extends React.Component {
  static displayName = 'Wcontainer';

  static defaultProps = {
    arrange: 'normal',
    height: '100%',
    operation: '',
    titleBorder: true
  };

  constructor(props) {
    super(props);
    this.state = { criticalError: null };

    // 图表初始化时记录日志
    chartLog('Wcontainer', 'init');
  }

  componentDidCatch(error, info) {
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    // Display fallback UI
    this.setState({ criticalError: error });
  }

  renderTitle(title, titleBorder, operation, titleStyle) {
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

  renderMainNormal(contentStyle, fullContent) {
    const { children: propsChildren, title } = this.props;

    const oneChild = React.Children.count(propsChildren) === 1;
    if ((oneChild && propsChildren && propsChildren.type && propsChildren.type.isG2Chart) || fullContent) {
      return (
        <div className={`${prefix}-main ${prefix}-main-one-chart ${title ? '' : 'no-title'}`} style={contentStyle}>
          {propsChildren}
        </div>
      );
    }

    return (
      <div className={`${prefix}-main ${title ? '' : 'no-title'}`} style={contentStyle}>
        <Row type="no-padding" align="center">
          {React.Children.map(propsChildren, (child, i) => {
            if (!child) {
              return child;
            }
            if (oneChild) {
              return (
                <Col span="24" key={i}>
                  {child}
                </Col>
              );
            }
            if (child.type.displayName === 'Wicon' || child.type.displayName === 'Wcircle') {
              return (
                <Col fixedSpan="2" key={i}>
                  {child}
                </Col>
              );
            }
            if (child.type.displayName === 'AiscWidgetsG2MiniLine') {
              return (
                <Col fixedSpan="4" key={i}>
                  {child}
                </Col>
              );
            }
            if (child.type.displayName === 'Divider') {
              return (
                <Col fixedSpan="1" key={i}>
                  {child}
                </Col>
              );
            }
            return <Col key={i}>{child}</Col>;
          })}
        </Row>
      </div>
    );
  }

  renderMainCross(contentStyle) {
    let maxColPerRow = 0;
    let currentColPerRow = 0;
    // 计算栅格的ColSpan
    React.Children.forEach(this.props.children, (child) => {
      if (child.type.displayName !== 'Divider') {
        currentColPerRow += 1;
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

  render() {
    const { width, height, arrange, title, titleBorder, operation, className, style, titleStyle, contentStyle, fullContent, isMobile,  ...otherProps } = this.props;
    const mainClasses = classNames({
      'aisc-widgets': true,
      [`${prefix}`]: true,
      [`${prefix}-mobile`]: isMobileWithProps(this.props, isMobile),
      [className]: !!className
    });

    const criticalError = this.state.criticalError;

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

Wcontainer.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

function chunks(arr, maxSpan) {
  const rs = [];
  let oneRow = [];
  React.Children.forEach(arr, (child, i) => {
    if (child.type && child.type.displayName === 'Divider') {
      rs.push(
        <Row type="across" align="center" key={i}>
          {oneRow}
        </Row>
      );
      oneRow = [];
    } else if (child.type === 'combiner' && oneRow.length) {
      const lastChild = oneRow[oneRow.length - 1].props.children;
      const lastSpan = oneRow[oneRow.length - 1].props.span;
      oneRow[oneRow.length - 1] = (
        <Col span={lastSpan + maxSpan} key={i}>
          {lastChild}
        </Col>
      );
    } else if (i === arr.length - 1) {
      oneRow.push(
        <Col span={maxSpan} key={i}>
          {child}
        </Col>
      );
      rs.push(
        <Row type="across" align="center" key={i}>
          {oneRow}
        </Row>
      );
    } else {
      oneRow.push(
        <Col span={maxSpan} key={i}>
          {child}
        </Col>
      );
    }
  });
  return rs;
}

Wcontainer.divider = Divider;
Wcontainer.combiner = 'combiner';
