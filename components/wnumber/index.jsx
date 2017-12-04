'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Warrow from '../chartCommon/arrow';
import './index.scss';

const prefix = 'aisc-wnumber';

export default class Wnumber extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    numberTrend: '',
    rightRatioTrend: '',
    status: ''
  };

  renderBottom() {
    const bottomTitle = this.props.bottomTitle;
    if (!!bottomTitle) {
      return(
        <div className={`${prefix}-bottomTitle`}>{bottomTitle}</div>
      );
    }
  }

  trendIconFunc(trend){
    if(trend === 'raise'){
      return <Warrow type="up"/>
    }else if( trend === 'drop'){
      return <Warrow type="down"/>
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
    });

    return (
      <div className={mainClasses}>
        {this.renderMain()}
        {this.renderBottom()}
      </div>
    );
  }
}

Wnumber.propTypes = {
  bottomTitle: PropTypes.node,
  unit: PropTypes.node,
  trend: PropTypes.func
};
