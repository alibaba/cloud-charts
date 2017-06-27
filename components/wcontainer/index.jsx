'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const prefix = 'aisc-wcontainer'

export default class Wcontainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`${prefix}`}>
        <div className={`${prefix}-main`} >
          <span>{this.props.children}</span>
          <span>hahaha</span>
        </div>
      </div>
    );
  }
}

Wcontainer.propTypes = {
  size: PropTypes.number
}

