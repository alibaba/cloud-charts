'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Grid } from '@alife/aisc';

import Divider from './views/divider';
import './index.scss';

const { Row, Col } = Grid;
const prefix = 'aisc-wcontainer'

export default class Wcontainer extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    arrange: 'normal'
  }

  renderTitle() {
    return (
      <div className={`${prefix}-title`}>
          {this.props.title}
          <span className={`${prefix}-time`}>
          </span>
      </div>
    );
  }

  renderMainNormal() {
    let { height = 0 } = this.props;

    let rowHeight = height;
    if ( this.props.title ) {
      //标题字体14px ,距下面有10px宽度
      rowHeight = rowHeight - 18 - 2 - 10 - 20;
    }

    const containerClasses = classNames({
      [`${prefix}-main`]: true,
    });

    return (
      <div className={containerClasses}>
          <Row align="center" style={{
            lineHeight: rowHeight + 'px',
            height: rowHeight + 'px'
          }}>
          {
            React.Children.map(this.props.children, (child, i) => {
              if (child.type.displayName === 'Wicon') {
                return <Col fixedSpan="2">{child}</Col>
              }
              if (child.type.Chart && child.type.Chart.displayName === 'Wminiline') {
                return <Col fixedSpan="4">{child}</Col>
              }
              if (child.type.displayName === 'Divider') {
                return <Col fixedSpan="1">{child}</Col>
              }
              return (
                <Col>{child}</Col>
              )
            })
          }
          </Row>
      </div>
    );
  }

  renderMainCross() {
    let {height = 0 } = this.props;

    let rowHeight = height;
    if ( this.props.title ) {
      //标题字体18px ,距下面有10px宽度
      rowHeight = rowHeight - 18 - 2 - 10 - 20;
    }
    console.log(rowHeight)
    const rowStyle = {
      lineHeight: rowHeight + 'px',
      height: rowHeight + 'px'
    };

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
      } else {
        if (currentColPerRow > maxColPerRow) {
          maxColPerRow = currentColPerRow;
        }
      }
    });
    const ColPerRow = ~~(24 / maxColPerRow);
    function chunks(arr, maxSpan) {
      const rs = [];
      let oneRow = [];
      React.Children.forEach(arr, (child, i) => {
        if(child.type.displayName === 'Divider') {
          rs.push(<Row align="center">{oneRow}</Row>);
          oneRow = [];
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
        <div className={`${prefix}-multi-row-container`} style={rowStyle}>{chunks(this.props.children, ColPerRow)}</div>
      </div>
    );
  }

  render() {
    const { height = 0, arrange, title } = this.props;

    return (
      <div className={`${prefix}`} style={{
        minHeight: height + 'px',
        height: height + 'px'
      }}>
      {title && this.renderTitle()}
      {arrange === 'normal' && this.renderMainNormal()}
      {arrange === 'cross' && this.renderMainCross()}
      </div>
    );
  }
}

Wcontainer.propTypes = {
  title: PropTypes.string,
  height: PropTypes.number,
}

Wcontainer.divider = Divider;
