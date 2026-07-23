'use strict';

import * as React from 'react';
import classNames from 'classnames';
import { getStatusColorName, chartLog, isMobileWithProps, MobileProps, FullCrossName, PrefixName, Status } from './_utils';

const prefix = `${PrefixName}-wminicontainer`;

export interface WminicontainerProps extends MobileProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  status?: Status | string;
  children?: React.ReactNode;
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
    }, className);

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
