'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Warrow from '../common/arrow';
import chartLog from "../common/log";
import './index.scss';

const prefix = 'aisc-wnumber';

function getTrendIcon(trend) {
  if(trend === 'raise'){
    return <Warrow type="up"/>
  }else if( trend === 'drop'){
    return <Warrow type="down"/>
  }
}

export default class Wnumber extends React.Component {
  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wnumber', 'init');
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

  renderMain() {
    const { status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio } = this.props;
    const numberTrendIcon = getTrendIcon(numberTrend);
    const numberClasses = `${prefix}-number`;

    const rightRatioTrendIcon = getTrendIcon(rightRatioTrend);
    const rightRatioTrendClasses = `${prefix}-rightRatio ${rightRatioTrend}`;

    return(
      <div className={`${prefix}-main ${numberTrend} ${status}`}>
        {
          numberTrend &&
          <span className={`${prefix}-leftIcon`}>
            {numberTrendIcon}
          </span>
        }
        <span className={numberClasses}>
          {this.props.children}
        </span>
        {
          unit &&
          <span className={`${prefix}-unit`}>
            {unit}
          </span>
        }
        {
          rightTitle &&
          <span className={`${prefix}-rightTitle`}>
            {rightTitle}
          </span>
        }
        {
          rightRatio &&
          <span className={rightRatioTrendClasses}>
            {
              rightRatioTrend &&
              <span className={`${prefix}-rightRatioIcon`}>
                {rightRatioTrendIcon}
              </span>
            }
            {rightRatio}
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
    const { className, style, ...otherProps} = this.props;

    const mainClasses = classNames({
      [`${prefix}`]: true,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={style} {...otherProps}>
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
