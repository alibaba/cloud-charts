'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import chartLog from "../common/log";
import Shoot from './shoot';

const prefix = 'aisc-wshoot';

export default class Wshoot extends React.Component {
  static displayName = 'Wshoot';

  static propTypes = {
    config: PropTypes.object,
    data: PropTypes.array
  };

  static defaultProps = {
    width: 800,
    height: 600,
    config: {},
    data: []
  };

  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wshoot', 'init');
  }

  canvas = null;
  shoot = null;

  componentDidMount() {
    const { width, height, config } = this.props;
    this.shoot = new Shoot(this.canvas, {}, {
      width,
      height,
      ...config
    });
  }

  componentDidUpdate(prevProps) {
    const newData = this.props.data;
    const oldData = prevProps.data;
    if (newData !== oldData) {
      this.shoot.draw(newData);
    }
  }

  componentWillUnmount() {
    this.shoot && this.shoot.destroy();
  }

  render() {
    const { className, ...otherProps } = this.props;

    const mainClasses = classNames(prefix, {
      [className]: !!className
    });

    return (
      <canvas className={mainClasses} {...otherProps} ref={(c) => this.canvas = c} />
    );
  }
}
