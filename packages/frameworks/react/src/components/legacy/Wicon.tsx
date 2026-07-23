'use strict';

import * as React from 'react';
import classNames from 'classnames';
import { getStatusColorName, chartLog, FullCrossName, PrefixName, Status } from './_utils';

const prefix = `${PrefixName}-wicon`;

export interface WiconProps {
  className?: string;
  style?: React.CSSProperties;
  type?: string;
  size?: string;
  status?: Status | string;
  reverse?: boolean;
}

export default class Wicon extends React.Component<WiconProps> {
  static displayName = 'Wicon';

  static defaultProps = {
    size: 'big',
    type: 'monitor',
    status: 'none'
  };

  constructor(props: WiconProps) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wicon', 'init');
  }

  render() {
    const { type, size, className, status, reverse, ...other } = this.props;
    const classes = classNames({
      [FullCrossName]: true,
      [`${prefix}-${type}`]: !!type,
      [`${prefix}`]: true,
      [`${prefix}-${size}`]: !!size,
      [`${prefix}-${getStatusColorName(status)}`]: !!status,
      [`${prefix}-reverse`]: !!reverse,
    }, className);

    return (
      <i className={classes} {...other} />
    );
  }
}
