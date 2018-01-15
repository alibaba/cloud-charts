'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@alife/aisc/lib/grid/index';

import Divider from './views/divider';
import './index.scss';

const { Row, Col } = Grid;
const prefix = 'aisc-wcontainer';

export default class Wcontainer extends React.Component {
  constructor(props) {
    super(props);
  }
  static defaultProps = {
    arrange: 'normal',
    height: '100%',
    operation: '',
    borderbottom: true
  };
  renderTitle() {
    const { borderbottom } = this.props;
    const hideborderbottom = borderbottom ? '' : `${prefix}-hideborderbottom`;
    return (
      <div className={`${prefix}-title ${hideborderbottom}`}>
        {this.props.title}
        {
          this.props.operation ?
            <div className={`${prefix}-operation`}>
              {this.props.operation}
            </div> : null
        }
      </div>
    );
  }

  renderMainNormal() {
    const propsChildren = this.props.children;
    const title = this.props.title;
    const oneChild = React.Children.count(propsChildren) === 1;
    if (oneChild && propsChildren && propsChildren.type.isG2Chart) {
      return (
        <div className={`${prefix}-main ${prefix}-main-one-chart ${title ? '' : 'no-title'}`}>
          {propsChildren}
        </div>
      );
    }

    return (
      <div className={`${prefix}-main`}>
        <Row align="center">
          {React.Children.map(this.props.children, (child, i) => {
            if (child.type.displayName === 'Wicon') {
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
            if (oneChild) {
              return (
                <Col span="24" key={i}>
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

  renderMainCross() {
    let maxColPerRow = 0;
    let currentColPerRow = 0;
    // 计算栅格的ColSpan
    React.Children.forEach(this.props.children, (child, i) => {
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
      <div className={`${prefix}-main ${prefix}-cross`}>
        <div className={`${prefix}-multi-row-container`}>{chunks(this.props.children, ColPerRow)}</div>
      </div>
    );
  }

  render() {
    const { height, arrange, title, className, style, ...otherProps } = this.props;
    const mainClasses = classNames({
      [`${prefix}`]: true,
      [className]: !!className
    });

    return (
      <div
        className={mainClasses}
        style={{
          minHeight: height,
          height: height,
          ...style
        }}
        {...otherProps}
        ref={o => { this.container = o; }}
      >
        {title && this.renderTitle()}
        {arrange === 'normal' && this.renderMainNormal()}
        {arrange === 'cross' && this.renderMainCross()}
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
      let lastChild = oneRow[oneRow.length - 1].props.children;
      let lastSpan = oneRow[oneRow.length - 1].props.span;
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
