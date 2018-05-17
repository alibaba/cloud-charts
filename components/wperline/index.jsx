'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

const prefix = 'aisc-wperline';

export default class Wperline extends React.Component {
  static defaultProps = {
    percent: 0,
    status: ''
  };

  render() {
    const { className, style, percent, status, ...others } = this.props;
    const barStyle = { width: `${percent}%` };
    const textStyle = {};

    if (percent < 15) {
      textStyle.marginRight = 0;
      textStyle.marginLeft = '100%';
      textStyle.paddingLeft = 7;
    }

    const cls = classNames(prefix, `${prefix}-status-${status}`, className);

    return (
      <div className={cls} style={style} {...others}>
        <div className={`${prefix}-num`} style={barStyle}>
          <span style={textStyle}>{percent}%</span>
        </div>
      </div>
    )
  }
}

Wperline.propTypes = {
  percent: PropTypes.number,
  status: PropTypes.string,
};
