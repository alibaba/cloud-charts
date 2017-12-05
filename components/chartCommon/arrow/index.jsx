'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

const prefix = 'aisc-warrow';

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