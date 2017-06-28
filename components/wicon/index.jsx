'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const prefix = 'aisc-wicon'

export default class Wicon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className={`${prefix}`}>
        <span className={`${this.props.iconClass} ${prefix}-icon`}></span>
        <span className={`${prefix}-title`}>
          {this.props.children}
        </span>
      </div>
    );
  }
}

Wicon.propTypes = {
  iconClass: PropTypes.string,
}

