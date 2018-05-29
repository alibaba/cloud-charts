'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getStatusColorName } from '../common/common';
import './index.scss';

const prefix = 'aisc-wicon';

export default class Wicon extends React.Component {
  static displayName = 'Wicon';

  static defaultProps = {
    size: 'big',
    type: 'monitor',
    status: 'none'
  };

  render() {
    const { type, size, classname, status, reverse, ...other } = this.props;
    const classes = classNames({
      [`${prefix}`]: true,
      [`next-icon`]: true,
      [`next-icon-${type}`]: !!type,
      [`${prefix}-${size}`]: !!size,
      [`${prefix}-${getStatusColorName(status)}`]: !!status,
      [`${prefix}-reverse`]: !!reverse,
      [classname]: !!classname
    });

    return (
      <i className={classes} {...other} />
    );
  }
}

Wicon.propTypes = {
  type: PropTypes.string,
};

