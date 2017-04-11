'use strict';

import React from 'react';
import { Grid } from '@alife/aisc';
import classNames from 'classnames';
import './index.scss';

const NextRow = Grid.Row,
      NextCol = Grid.Col;

class Row extends React.Component {

  render() {
    const { children, className, ...others } = this.props;
    const classes = classNames({
      [className]: !!className,
      'p2-row': true
    });
    return (
      <NextRow className={classes} {...others}>{children}</NextRow>
    );
  }
}

class Col extends React.Component {

  render() {
    const { children, className, ...others } = this.props;
    const classes = classNames({
      [className]: !!className,
      'p2-col': true
    });
    return (
      <NextCol className={classes} {...others}>{children}</NextCol>
    );
  }
}

export default {
  Row,
  Col
};