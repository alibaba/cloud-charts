'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.scss';

const prefix = 'aisc-wminicontainer';

export default class Wminicontainer extends React.Component {
  static defaultProps = {
    status: ''
  };

  render() {
    const { height = 80, className, status } = this.props;
    const mainClasses = classNames({
      [`${prefix}`]: true,
      [`${prefix}-${status}`]: !!status,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={{
        minHeight: height,
        height: height
      }}>
        {this.props.children}
      </div>
    );
  }
}

Wminicontainer.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

