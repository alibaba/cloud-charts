'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Wicon from '../wicon';
import './index.scss';

const prefix = 'aisc-wnumber'

export default class Wnumber extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    numberTrend: ''
  }

  renderBottom() {
    const bottomTitle = this.props.bottomTitle;
    const bottomTitleClasses = classNames({
      [`${prefix}-bottomTitle`]: true
    })
    if (!!bottomTitle) {
      return(
        <div className={bottomTitleClasses}>{bottomTitle}</div>
      )
    }
  }

  renderMain() {
    let numberTrendIcon;
    let numberClasses = `${prefix}-number`;
    if (this.props.numberTrend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = <Wicon type="arrow-up-filling" size="small" classname="raise" />
    } else if (this.props.numberTrend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = <Wicon type="arrow-down-filling" size="small" classname="drop" />
    }

    return(
      <div className={`${prefix}-main`}>
        {
          this.props.numberTrend &&
          <span className={`${prefix}-leftIcon`}>
            {numberTrendIcon}
          </span>
        }
        <span className={numberClasses}>
          {this.props.children}
        </span>
        {
          this.props.unit &&
          <span className={`${prefix}-unit`}>
            {this.props.unit}
          </span>
        }
        {
          this.props.rightTitle &&
          <span className={`${prefix}-rightTitle`}>
            {this.props.rightTitle}
          </span>
        }
        { this.props.trend &&
          <span className={`${prefix}-trend`}>
            {this.props.trend()}
          </span>
        }
      </div>
    );
  }

  render() {
    const { className} = this.props;

    const mainClasses = classNames({
      [`${prefix}`]: true,
      [className]: !!className
    })

    return (
      <div className={mainClasses}>
        {this.renderMain()}
        {this.renderBottom()}
      </div>
    );
  }
}

Wnumber.propTypes = {
  bottomTitle: PropTypes.string,
  unit: PropTypes.string,
  trend: PropTypes.func
}
