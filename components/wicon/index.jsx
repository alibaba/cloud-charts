'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon } from '@alife/aisc';
import './index.scss';

const prefix = 'aisc-wicon'

export default class Wicon extends React.Component {
  constructor(props) {
    super(props);
  };

  static displayName = 'Wicon';

  static defaultProps = {
    size: 'big',
    type: 'monitor'
  };

  render() {
    const { type, size, classname, ...other } = this.props;
    const classes = classNames({
      [`${prefix}`]: true,
      [`next-icon`]: true,
      [`next-icon-${type}`]: !!type,
      [`${prefix}-${size}`]: !!size,
      [classname]: !!classname
    });

    return (
      <i className={classes}></i>
    );
  }
}

Wicon.propTypes = {
  type: PropTypes.string,
}

