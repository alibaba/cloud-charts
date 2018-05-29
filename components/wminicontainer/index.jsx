'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getStatusColorName } from '../common/common';
import './index.scss';

const prefix = 'aisc-wminicontainer';

export default class Wminicontainer extends React.Component {
  static defaultProps = {
    status: ''
  };

  render() {
    const { height = 80, className, status, style, ...otherProps } = this.props;
    const mainClasses = classNames({
      [`${prefix}`]: true,
      [`${prefix}-${getStatusColorName(status)}`]: !!status,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={{
        minHeight: height,
        height: height,
        ...style
      }}
         {...otherProps}
      >
        {this.props.children}
      </div>
    );
  }
}

Wminicontainer.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

