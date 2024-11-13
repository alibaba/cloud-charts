'use strict';

import * as React from 'react';
import classNames from 'classnames';
import { getStatusColorName, beautifyNumber } from '../common/common';
import Warrow from '../common/arrow';
import chartLog from "../common/log";
import { Status, Trend } from '../common/types';
import { FullCrossName, PrefixName } from '../constants';
import './index.scss';

const prefix = `${PrefixName}-wnumber`;

function getTrendIcon(trend: Trend) {
  if(trend === 'raise'){
    return <Warrow type="up"/>
  } else if( trend === 'drop'){
    return <Warrow type="down"/>
  } else {
    return null;
  }
}

export interface WnumberProps {
  className?: string;
  style?: React.CSSProperties;
  status?: Status | string;
  unit?: React.ReactNode;
  numberTrend?: Trend;
  rightRatioTrend?: Trend;
  rightTitle?: React.ReactNode;
  rightRatio?: React.ReactNode;
  rightRatioStatus?: Status | string;
  trend?: () => React.ReactNode;
  bottomTitle?: React.ReactNode;
}

export default class Wnumber extends React.Component<WnumberProps> {
  static displayName = 'Wnumber';

  static defaultProps = {
    numberTrend: '',
    rightRatioTrend: '',
    status: ''
  };

  constructor(props: WnumberProps) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wnumber', 'init');
  }

  renderBottom(bottomTitle: React.ReactNode) {
    if (!!bottomTitle) {
      return(
        <div className={`${prefix}-bottomTitle`}>{bottomTitle}</div>
      );
    } else {
      return null;
    }
  }

  renderMain(
    status: string,
    unit: React.ReactNode,
    numberTrend: Trend,
    rightRatioTrend: Trend,
    rightTitle: React.ReactNode,
    rightRatio: React.ReactNode,
    rightRatioStatus: string,
    trend: () => React.ReactNode,
    children: React.ReactNode,
  ) {
    const numberTrendIcon = getTrendIcon(numberTrend);
    const numberClasses = `${prefix}-number`;

    const rightRatioTrendIcon = getTrendIcon(rightRatioTrend);
    const rightRatioTrendClasses = `${prefix}-rightRatio ${rightRatioTrend} ${rightRatioStatus ? getStatusColorName(rightRatioStatus) : ''}`;

    return(
      <div className={`${prefix}-main ${numberTrend} ${status ? getStatusColorName(status) : ''}`}>
        {
          numberTrend &&
          <span className={`${prefix}-leftIcon`}>
            {numberTrendIcon}
          </span>
        }
        <span className={numberClasses}>
          {beautifyNumber(children)}
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
        { trend &&
          <span className={`${prefix}-trend`}>
            {trend()}
          </span>
        }
      </div>
    );
  }

  render() {
    const {
      className, style,
      // main props
      status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, rightRatioStatus, trend, children,
      // bottom props
      bottomTitle,
      ...otherProps
    } = this.props;

    const mainClasses = classNames({
      [FullCrossName]: true,
      [`${prefix}`]: true,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={style} {...otherProps}>
        {this.renderMain(status, unit, numberTrend, rightRatioTrend, rightTitle, rightRatio, rightRatioStatus, trend, children)}
        {this.renderBottom(bottomTitle)}
      </div>
    );
  }
}
