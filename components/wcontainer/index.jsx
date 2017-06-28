'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

import Wicon from '../wicon/index';

const prefix = 'aisc-wcontainer'

export default class Wcontainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { height="100%" } = this.props;
    const styleObj = {
      height: height,
    };

    return (
      <div className={`${prefix}`} style={styleObj}>
        <div className={`${prefix}-title`}>
          {this.props.title}
        </div>
        <div className={`${prefix}-main`} >
          {this.props.children}
          
        </div>
      </div>
    );
  }
}

Wcontainer.propTypes = {
  title: PropTypes.string,
  height: PropTypes.string,
}

