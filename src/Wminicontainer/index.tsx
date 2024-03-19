'use strict';

import * as React from 'react';
import classNames from 'classnames';
import { getStatusColorName } from '../common/common';
import chartLog from "../common/log";
import { isMobileWithProps, MobileProps } from "../common/platform";
import { Status } from '../common/types';
import { FullCrossName, PrefixName } from '../constants';
import './index.scss';

const prefix = `${PrefixName}-wminicontainer`;

export interface WminicontainerProps extends MobileProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  status?: Status | string;
}

export default class Wminicontainer extends React.Component<WminicontainerProps> {
  static displayName = 'Wminicontainer';

  static defaultProps = {
    status: ''
  };

  constructor(props: WminicontainerProps) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wminicontainer', 'init');
  }

  render() {
    const { height = 80, className, status, style, isMobile, ...otherProps } = this.props;
    const mainClasses = classNames({
      [FullCrossName]: true,
      [`${prefix}`]: true,
      [`${prefix}-mobile`]: isMobileWithProps(this.props),
      [`${prefix}-${getStatusColorName(status)}`]: !!status,
      [className]: !!className
    });

    return (
      <div className={mainClasses} style={{
        minHeight: height,
        height: height,
        ...style
      }}
         {...otherProps}
      >
        {this.props.children}
      </div>
    );
  }
}
