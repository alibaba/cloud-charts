'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getStatusColorName } from '../common/common';
import chartLog from "../common/log";
import './index.scss';

const prefix = 'aisc-wicon';

export default class Wicon extends React.Component {
  static displayName = 'Wicon';

  static defaultProps = {
    size: 'big',
    type: 'monitor',
    status: 'none'
  };

  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wicon', 'init');
  }

  render() {
    const { type, size, className, status, reverse, ...other } = this.props;
    const classes = classNames({
      // [`next-icon`]: true,
      [`${prefix}-${type}`]: !!type,
      [`${prefix}`]: true,
      [`${prefix}-${size}`]: !!size,
      [`${prefix}-${getStatusColorName(status)}`]: !!status,
      [`${prefix}-reverse`]: !!reverse,
      [className]: !!className
    });

    return (
      <i className={classes} {...other} />
    );
  }
}

Wicon.propTypes = {
  type: PropTypes.string,
};

