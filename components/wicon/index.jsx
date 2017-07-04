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
  }

  render() {
    const { type, size, classname, ...other } = this.props;
    const classes = classNames({
      [`next-icon`]: true,
      [`next-icon-${type}`]: !!type,
      // [`next-icon-${size}`]: !!size,
      [classname]: !!classname
    })

    return (
      <div className={`${prefix}`}>
        <span className={classes}></span>
      </div>
    );
  }
}

Wicon.propTypes = {
  type: PropTypes.string,
}

