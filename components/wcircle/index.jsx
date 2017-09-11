'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Wicon from '../wicon';
import './index.scss';

const prefix = 'aisc-wcircle';
const strokeWidth = 6;
const radius =60;


export default class Wcircle extends React.Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    type: 'circle',
    title: '',
    percent: 0,
    unit: '',
    status: 'blue',
    height: radius * 2
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
      numberTrendIcon = <Wicon type="arrow-up-filling" size="small" classname="raise" />
    } else if (bottomTrend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = <Wicon type="arrow-down-filling" size="small" classname="drop" />
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
    if (this.props.trend === 'raise') {
      numberClasses += ' raise';
      numberTrendIcon = <Wicon type="arrow-up-filling" size="small" classname="raise" />
    } else if (this.props.trend === 'drop') {
      numberClasses += ' drop';
      numberTrendIcon = <Wicon type="arrow-down-filling" size="small" classname="drop" />
    }

    const radiusInner = (radius - strokeWidth / 2);
    const pathString = `M ${radius},${radius} m 0,${radiusInner}
     a ${radiusInner},${radiusInner} 0 1 1 0,-${2 * radiusInner}
     a ${radiusInner},${radiusInner} 0 1 1 0,${2 * radiusInner}`;
    const circleLengh = Math.PI * 2 * radiusInner;

    let openWidth, pathDashoffset, strokeDashoffset;
    if(this.props.type === 'circle'){
      openWidth = 0;
      pathDashoffset = '0px';
      strokeDashoffset = `-${circleLengh / 2}px`;
    }else if(this.props.type === 'gauge'){
      openWidth = Math.PI * 0.4 * radiusInner;
      pathDashoffset = `-${openWidth / 2}px`;
      strokeDashoffset = `-${openWidth / 2}px`;
    }

    const pathStyle = {
      strokeDasharray: `${circleLengh-openWidth}px ${circleLengh}px`,
      strokeDashoffset: pathDashoffset
    };
    const strokePathStyle = {
      strokeDasharray: `${this.props.percent * (circleLengh - openWidth)}px ${circleLengh}px`,
      strokeDashoffset: strokeDashoffset
    };

    const svgStyle = {
      height: (radius + strokeWidth / 2) * 2,
      width: (radius + strokeWidth / 2) * 2
    }

    return(
      <div className={`${prefix}-main ${this.props.status}`}>
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
            {
              this.props.trend && <span className={`${prefix}-leftIcon`}>{numberTrendIcon}</span>
            }
            <span className={numberClasses}>
              {this.props.children}
              {
                this.props.unit && <span className={`${prefix}-unit`}>{this.props.unit}</span>
              }
            </span>
            <p className={`${prefix}-title`}>{this.props.title}</p>
          </div>
          {this.props.type === 'gauge' && this.renderBottom()}
        </div>
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
      </div>
    );
  }
}

Wcircle.propTypes = {
  type: React.PropTypes.oneOf(['gauge', 'circle']),
  title: PropTypes.string,
  percent: function(props, propName, componentName){
    if(!(props[propName] >= 0 && props[propName] <= 1)){
      return new Error('Validation failed!');
    }
  },
  unit: PropTypes.string,
  status: React.PropTypes.oneOf(['blue', 'orange', 'red']),
  trend: React.PropTypes.oneOf(['raise', 'drop']),
  bottomTitle: PropTypes.string,
  bottomUnit: PropTypes.string,
  bottomNumber: PropTypes.number,
  bottomTrend: React.PropTypes.oneOf(['raise', 'drop'])
}
