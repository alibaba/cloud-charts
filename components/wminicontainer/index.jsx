'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.scss';

const prefix = 'aisc-wminicontainer'

export default class Wminicontainer extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    status: 'blue'
  }

  render() {
    const { height = 0, className, status } = this.props;
    const mainClasses = classNames({
      [`${prefix}`]: true,
      [`${prefix}` + `-` + `${status}`]: true,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={{
        minHeight: height + 'px',
        height: height + 'px'
      }}>
        {this.props.children}
      </div>
    );
  }
}

Wminicontainer.propTypes = {
  height: PropTypes.number
}

