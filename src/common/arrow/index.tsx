'use strict';
import * as React from 'react';
import classNames from 'classnames';
import { PrefixName } from '../../constants';
import './index.scss';

const prefix = `${PrefixName}-warrow`;

interface ArrowProps {
  type: 'up' | 'down';
}

export default class Wcircle extends React.Component<ArrowProps> {
  static defaultProps = {
    type: 'up',
  };

  render() {
    const { type } = this.props;
    const mainClasses = classNames(prefix, `${prefix}-${type}`);

    return (<i className={mainClasses} />);
  }
}
