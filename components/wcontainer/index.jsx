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
    height: '100%'
  };

  renderTitle() {
    return (
      <div className={`${prefix}-title`}>
        {this.props.title}
        <span className={`${prefix}-time`} />
      </div>
    );
  }

  renderMainNormal() {
    const containerClasses = classNames({
      [`${prefix}-main`]: true
    });

    return (
      <div className={`${prefix}-main`}>
        <Row align="center">
          {React.Children.map(this.props.children, (child, i) => {
            if (child.type.displayName === 'Wicon') {
              return <Col fixedSpan="2">{child}</Col>;
            }
            if (child.type.Chart && child.type.Chart.displayName === 'Wminiline') {
              return <Col fixedSpan="4">{child}</Col>;
            }
            if (child.type.displayName === 'Divider') {
              return <Col fixedSpan="1">{child}</Col>;
            }
            return <Col>{child}</Col>;
          })}
        </Row>
      </div>
    );
  }

  renderMainCross() {
    const containerClasses = classNames({
      [`${prefix}-main`]: true,
      [`${prefix}-cross`]: true
    });

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
    function chunks(arr, maxSpan) {
      const rs = [];
      let oneRow = [];
      React.Children.forEach(arr, (child, i) => {
        if (child.type && child.type.displayName === 'Divider') {
          rs.push(<Row align="center">{oneRow}</Row>);
          oneRow = [];
        } else if (child.type === 'combiner' && oneRow.length) {
          let lastChild = oneRow[oneRow.length - 1].props.children;
          let lastSpan = oneRow[oneRow.length - 1].props.span;
          oneRow[oneRow.length - 1] = <Col span={lastSpan + ColPerRow}>{lastChild}</Col>;
        } else if (i === arr.length - 1) {
          oneRow.push(<Col span={ColPerRow}>{child}</Col>);
          rs.push(<Row align="center">{oneRow}</Row>);
        } else {
          oneRow.push(<Col span={ColPerRow}>{child}</Col>);
        }
      });
      return rs;
    }

    return (
      <div className={containerClasses}>
        <div className={`${prefix}-multi-row-container`}>{chunks(this.props.children, ColPerRow)}</div>
      </div>
    );
  }

  render() {
    const { height, arrange, title, className } = this.props;
    const mainClasses = classNames({
      [`${prefix}`]: true,
      [className]: !!className
    });

    return (
      <div
        className={mainClasses}
        style={{
          minHeight: height,
          height: height
        }}
        ref={o => {
          this.container = o;
        }}
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

Wcontainer.divider = Divider;
Wcontainer.combiner = 'combiner';
