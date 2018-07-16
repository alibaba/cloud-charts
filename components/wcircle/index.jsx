'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Warrow from '../common/arrow';
import { getStatusColorName } from '../common/common';
import chartLog from "../common/log";
import './index.scss';

const prefix = 'aisc-wcircle';

export default class Wcircle extends React.Component {
  static displayName = 'Wcircle';

  static defaultProps = {
    type: 'circle',
    title: '',
    percent: 0,
    unit: '',
    status: 'normal',
    radius: 70,
    strokeWidth: 6
  };

  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wcircle', 'init');
  }

  renderBottom() {
    const bottomTitle = this.props.bottomTitle;
    const bottomUnit = this.props.bottomUnit;
    const bottomNumber = this.props.bottomNumber;
    const bottomTrend = this.props.bottomTrend;

    const bottomClasses = classNames({
      [`${prefix}-bottom-block`]: true
    });

    let numberTrendIcon;
    let numberClasses = `${prefix}-bottom-number`;
    if (bottomTrend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = <Warrow type="up"/>
    } else if (bottomTrend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = <Warrow type="down"/>
    }

    if (!!bottomTitle || !!bottomUnit ||!!bottomNumber || !!bottomTrend) {
      return(
        <div className={bottomClasses}>
          {
            bottomTrend && <span className={`${prefix}-leftIcon`}>{numberTrendIcon}</span>
          }
          <span className={numberClasses}>
              {bottomNumber}
            {
              bottomUnit && <span className={`${prefix}-bottom-unit`}>{bottomUnit}</span>
            }
            </span>
          <p className={`${prefix}-title`}>{bottomTitle}</p>
        </div>
      )
    }
  }

  renderMain() {
    let numberTrendIcon;
    let numberClasses = `${prefix}-number`;

    const trend = this.props.trend;
    const type = this.props.type;
    const percent = this.props.percent;
    const radius = this.props.radius;
    const strokeWidth = this.props.strokeWidth;
    const status = this.props.status;
    const customColor = this.props.color;

    const style = {};
    if (customColor) {
      style.color = customColor;
    }

    if (trend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = <Warrow type="up"/>
    } else if (trend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = <Warrow type="down"/>
    }

    const radiusInner = (radius - strokeWidth / 2);
    const pathString = `M ${radius},${radius} m 0,${radiusInner}
     a ${radiusInner},${radiusInner} 0 1 1 0,-${2 * radiusInner}
     a ${radiusInner},${radiusInner} 0 1 1 0,${2 * radiusInner}`;
    const circleLengh = Math.PI * 2 * radiusInner;

    let openWidth, pathDashoffset, strokeDashoffset, strokePathStyle;
    if(type === 'circle'){
      openWidth = 0;
      pathDashoffset = '0px';
      strokeDashoffset = `-${circleLengh / 2}px`;
      strokePathStyle = {
        strokeDasharray: `${percent * (circleLengh - openWidth)}px ${(1-percent) * (circleLengh - openWidth)}px`,
        strokeDashoffset: strokeDashoffset
      };
    }else if(type === 'gauge'){
      openWidth = Math.PI * 0.45 * radiusInner;
      pathDashoffset = `-${openWidth / 2}px`;
      strokeDashoffset = `-${openWidth / 2}px`;
      strokePathStyle = {
        strokeDasharray: `${percent * (circleLengh - openWidth)}px ${circleLengh}px`,
        strokeDashoffset: strokeDashoffset
      };
    }

    const pathStyle = {
      strokeDasharray: `${circleLengh-openWidth}px ${circleLengh}px`,
      strokeDashoffset: pathDashoffset
    };

    const svgStyle = {
      height: radius * 2,
      width: radius * 2
    };

    return(
      <div className={`${prefix}-main ${getStatusColorName(status)}`} style={style}>
        <div className={`${prefix}-ratio`}>
          <div className={`${prefix}-ratio-svg`} style={svgStyle}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
              <path
                className={`${prefix}-svg-bg`}
                d={pathString}
                strokeWidth={strokeWidth}
                style={pathStyle}
              />
              <path
                className={`${prefix}-svg-ring`}
                d={pathString}
                strokeWidth={strokeWidth}
                ref={(path) => { this.path = path; }}
                style={strokePathStyle}
              />
            </svg>
          </div>
          <div className={`${prefix}-number-block`}>
            <div className={`${prefix}-number-middle`}>
              {
                trend && <span className={`${prefix}-leftIcon`}>{numberTrendIcon}</span>
              }
              <span className={numberClasses}>
                {this.props.children}
                {
                  this.props.unit && <span className={`${prefix}-unit`}>{this.props.unit}</span>
                }
              </span>
              <p className={`${prefix}-title`}>{this.props.title}</p>
            </div>
          </div>
          {type === 'gauge' && this.renderBottom()}
        </div>
      </div>
    );
  }

  render() {
    const { className, ...otherProps } = this.props;

    const mainClasses = classNames({
      [prefix]: true,
      [className]: !!className
    });

    return (
      <div className={mainClasses} {...otherProps}>
        {this.renderMain()}
      </div>
    );
  }
}

Wcircle.propTypes = {
  type: PropTypes.oneOf(['gauge', 'circle']),
  title: PropTypes.node,
  percent: function(props, propName){
    if(!(props[propName] >= 0 && props[propName] <= 1)){
      return new Error('Validation failed!');
    }
  },
  unit: PropTypes.node,
  status: PropTypes.oneOf(['normal', 'warning', 'error', 'blue', 'orange', 'red']),
  // 半径
  radius: function(props, propName){
    if(!(props[propName] >= 10 && props[propName] <= 100)){
      return new Error('Validation failed!');
    }
  },
  // 粗细
  strokeWidth: function(props, propName){
    if(!(props[propName] >= 2 && props[propName] <= 10)){
      return new Error('Validation failed!');
    }
  },
  // 趋势
  trend: PropTypes.oneOf(['raise', 'drop']),
  bottomTitle: PropTypes.node,
  bottomUnit: PropTypes.node,
  bottomNumber: PropTypes.node,
  bottomTrend: PropTypes.oneOf(['raise', 'drop'])
};
