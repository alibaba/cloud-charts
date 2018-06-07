'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// 暂时无需样式
// import './index.scss';

import chartLog from "../common/log";
import Shoot from './shoot';

const prefix = 'aisc-wshoot';

export default class Wshoot extends React.Component {
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

  componentWillReceiveProps(nextProps) {
    const newData = nextProps.data;
    const oldData = this.props.data;
    if (newData !== oldData) {
      this.shoot.draw(newData);
    }
  }

  componentWillUnmount() {
    this.shoot && this.shoot.destroy();
  }

  render() {
    const { className, ...otherProps } = this.props;

    const mainClasses = classNames({
      [`${prefix}`]: true,
      [className]: !!className
    });

    return (
      <canvas className={mainClasses} {...otherProps} ref={(c) => this.canvas = c} />
    );
  }
}
