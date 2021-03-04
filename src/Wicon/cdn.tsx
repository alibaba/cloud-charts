'use strict';

import * as React from 'react';
import classNames from 'classnames';
import { getStatusColorName } from '../common/common';
import chartLog from "../common/log";
import { FullCrossName, PrefixName } from '../constants';
import './cdn.scss';
import { Status } from '../common/types';

const prefix = `${PrefixName}-wicon`;

interface WiconProps {
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
      // [`next-icon`]: true,
      [`${prefix}-${type}`]: !!type,
      [`${prefix}`]: true,
      [`${prefix}-${size}`]: !!size,
      [`${prefix}-${getStatusColorName(status)}`]: !!status,
      [`${prefix}-reverse`]: !!reverse,
      [className]: !!className
    });

    return (
      <i className={classes} {...other} />
    );
  }
}
