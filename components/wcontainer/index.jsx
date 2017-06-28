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
    let { width="100%", height="100%", theme="white" } = this.props;
    const styleObj = {
      width: width,
      height: height,
      background: theme
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
  width: PropTypes.string,
  height: PropTypes.string,
  theme: PropTypes.string
}

