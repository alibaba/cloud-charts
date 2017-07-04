'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

const prefix = 'aisc-wnumber'

export default class Wnumber extends React.Component {
  constructor(props) {
    super(props);
  }

  renderBottomTitle() {
    const bottomTitle = this.props.bottomTitle;
    const bottomTitleClasses = classNames({
      [`${prefix}-bottomTitle`]: true,
      bottom: true
    })
    if (!!bottomTitle) {
      return(
        <div className={bottomTitleClasses}>{bottomTitle}</div>
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
        { this.props.trend &&
          <span className={`${prefix}-trend`}>
            {this.props.trend()}
          </span>
        }
      </div>
    );
  }

  render() {
    return (
      <div className={`${prefix}`}>
        {this.renderMain()}
        {this.props.bottomTitle && this.renderBottomTitle()}
      </div>
    );
  }
}

Wnumber.propTypes = {
  bottomTitle: PropTypes.string,
  unit: PropTypes.string,
  trend: PropTypes.func
}
