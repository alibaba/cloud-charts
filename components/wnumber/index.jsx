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
    numberTrend: '',
    rightRatioTrend: ''
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

  trendIconFunc(trend){
    if(trend === 'raise'){
      return <Wicon type="arrow-up-filling" size="small" classname={`${trend}`} />
    }else if( trend === 'drop'){
      return <Wicon type="arrow-down-filling" size="small" classname={`${trend}`} />
    }
  }

  renderMain() {

    let numberTrendIcon = this.trendIconFunc(this.props.numberTrend);
    let numberClasses = `${prefix}-number`;

    let rightRatioTrendIcon = this.trendIconFunc(this.props.rightRatioTrend);
    let rightRatioTrendClasses = `${prefix}-ratio ${this.props.rightRatioTrend}`;

    // rightRatioTrend
    return(
      <div className={`${prefix}-main ${this.props.numberTrend} ${this.props.status}`}>
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
        {
          this.props.rightRatio &&
          <span className={`${prefix}-rightRatio ${this.props.rightRatioTrend}`}>
            {
              this.props.rightRatioTrend &&
              <span className={`${prefix}-rightRatioIcon`}>
                {rightRatioTrendIcon}
              </span>
            }
            {this.props.rightRatio}
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
