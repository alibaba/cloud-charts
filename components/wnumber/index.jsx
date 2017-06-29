'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const prefix = 'aisc-wnumber'

export default class Wnumber extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSubTitle() {
    const subTitle = this.props.subTitle;
    if (!!subTitle) {
      return(
        <div className={`${prefix}-subTitle`}>{subTitle}</div>
      )
    }
  }

  renderMain() {
    return(
      <div className={`${prefix}-main`}>
        <span className={`${prefix}-number`}>
          {this.props.children}
        </span>
        <span className={`${prefix}-unit`}>
            {this.props.unit}
        </span>
        <span className={`${prefix}-trend`}>+27%</span>
      </div>
    );
  }

  render() {
    return (
      <div className={`${prefix}`}>
        {this.renderMain()}
        {this.renderSubTitle()}
      </div>
    );
  }
}

Wnumber.propTypes = {
  subTitle: PropTypes.string,
  unit: PropTypes.string
}
