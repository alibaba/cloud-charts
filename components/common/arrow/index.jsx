'use strict';
import React from 'react';
import classNames from 'classnames';
import './index.scss';

const prefix = 'cloud-warrow';

export default class Wcircle extends React.Component {
  static defaultProps = {
    type: 'up',
  };

  render() {
    const { type } = this.props;
    const mainClasses = classNames(prefix, `${prefix}-${type}`);

    return (<i className={mainClasses} />);
  }
}
