'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Warrow from '../common/arrow';
import { getStatusColorName } from '../common/common';
import chartLog from "../common/log";
import './index.scss';

const prefix = 'cloud-wcircle';

export default class Wcircle extends React.Component {
  static displayName = 'Wcircle';

  static defaultProps = {
    type: 'circle',
    title: '',
    percent: 0,
    unit: '',
    status: 'normal',
    radius: 70,
    strokeWidth: 6,
    linecap: 'round',
  };

  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wcircle', 'init');
  }

  renderBottom(bottomTitle, bottomUnit, bottomNumber, bottomTrend) {
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
        <div className={`${prefix}-bottom-block`}>
          <span className={numberClasses}>
            {
              bottomTrend && <span className={`${prefix}-leftIcon`}>{numberTrendIcon}</span>
            }
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

  renderMain({title, unit, children, trend, type, percent, radius, strokeWidth, status, color: customColor, backgroundColor, bottomTitle, bottomUnit, bottomNumber, bottomTrend, linecap}) {
    let numberTrendIcon;
    let numberClasses = `${prefix}-number`;

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

    if (backgroundColor) {
      pathStyle.stroke = backgroundColor;
    }

    const svgStyle = {
      height: radius * 2,
      width: radius * 2
    };

    return(
      <div className={`${prefix}-main ${getStatusColorName(status)}`} style={style}>
        <div className={`${prefix}-ratio`}>
          <div className={`${prefix}-ratio-svg`} style={svgStyle}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1" className={linecap}>
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
                style={strokePathStyle}
              />
            </svg>
          </div>
          <div className={`${prefix}-number-block`}>
            <div className={`${prefix}-number-middle`}>
              <span className={numberClasses}>
                {
                  trend && <span className={`${prefix}-leftIcon`}>{numberTrendIcon}</span>
                }
                {children}
                {
                  unit && <span className={`${prefix}-unit`}>{unit}</span>
                }
              </span>
              {
                title && <p className={`${prefix}-title`}>{title}</p>
              }
            </div>
          </div>
          {type === 'gauge' && this.renderBottom(bottomTitle, bottomUnit, bottomNumber, bottomTrend)}
        </div>
      </div>
    );
  }

  render() {
    const {
      className, style,
      trend, type, percent, title, unit, children,
      radius, strokeWidth, status, color, backgroundColor, linecap,
      bottomTitle, bottomUnit, bottomNumber, bottomTrend,
      ...otherProps
    } = this.props;

    const mainClasses = classNames({
      'cloud-charts': true,
      [prefix]: true,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={style} {...otherProps}>
        {
          this.renderMain({
            title,
            unit,
            children,
            trend,
            percent,
            type,
            radius,
            strokeWidth,
            status,
            color,
            backgroundColor,
            linecap,
            bottomTitle,
            bottomUnit,
            bottomNumber,
            bottomTrend,
          })
        }
      </div>
    );
  }
}

Wcircle.propTypes = {
  type: PropTypes.oneOf(['gauge', 'circle']),
  title: PropTypes.node,
  percent: function(props, propName){
    if(!(props[propName] >= 0 && props[propName] <= 1)){
      return new Error('percent Validation failed!');
    }
  },
  unit: PropTypes.node,
  status: PropTypes.oneOf(['normal', 'warning', 'error', 'success', 'none', 'blue', 'orange', 'red', 'green', 'gray']),
  // 半径
  radius: function(props, propName){
    if(!(props[propName] >= 10 && props[propName] <= 100)){
      return new Error('radius Validation failed!');
    }
  },
  // 粗细
  strokeWidth: function(props, propName){
    if(!(props[propName] >= 2 && props[propName] <= 10)){
      return new Error('strokeWidth Validation failed!');
    }
  },
  // 趋势
  trend: PropTypes.oneOf(['raise', 'drop']),
  bottomTitle: PropTypes.node,
  bottomUnit: PropTypes.node,
  bottomNumber: PropTypes.node,
  bottomTrend: PropTypes.oneOf(['raise', 'drop'])
};
