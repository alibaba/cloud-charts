'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

import chartLog from "../common/log";
import Shoot from './shoot';

const prefix = 'cloud-wshoot';

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
    const { width, height, config, getPosition, data } = this.props;
    this.shoot = new Shoot(this.canvas, getPosition, {
      width,
      height,
      ...config
    });
    this.shoot.draw(data);
  }

  componentDidUpdate(prevProps) {
    const { data: newData, width: newWidth, height: newHeight, getPosition } = this.props;
    const { data: oldData, width: oldWidth, height: oldHeight } = prevProps;
    // 更新 getPosition 函数
    this.shoot.getPosition = getPosition;
    // 绘制飞线
    if (newData !== oldData) {
      this.shoot.draw(newData);
    }
    // 调整尺寸
    if (newWidth !== oldWidth || newHeight !== oldHeight) {
      this.shoot.changeSize(newWidth, newHeight);
    }
  }

  componentWillUnmount() {
    this.shoot && this.shoot.destroy();
  }

  render() {
    const { className, data, config, getPosition, ...otherProps } = this.props;

    const mainClasses = classNames(prefix, {
      [className]: !!className
    });

    return (
      <canvas className={mainClasses} {...otherProps} ref={(c) => this.canvas = c} />
    );
  }
}
