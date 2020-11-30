'use strict';

import * as React from 'react';
import classNames from 'classnames';
import {  Types, ChartData } from '../common/types';
import chartLog from "../common/log";
import Shoot from './shoot';
import { PrefixName } from '../constants';
import './index.scss';

const prefix = `${PrefixName}-wshoot`;

export interface ShootProps {
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
  config: {},
  data: ChartData;
  getPosition(d: Types.LooseObject): { x: number, y: number };
}

export default class Wshoot extends React.Component<ShootProps> {

  static defaultProps = {
    width: 800,
    height: 600,
    config: {},
  };

  constructor(props: ShootProps) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wshoot', 'init');
  }

  canvas: HTMLCanvasElement = null;
  shoot: any = null;

  componentDidMount() {
    const { width, height, config, getPosition, data } = this.props;
    this.shoot = new Shoot(this.canvas, getPosition, {
      width,
      height,
      ...config
    });
    this.shoot.draw(data);
  }

  componentDidUpdate(prevProps: ShootProps) {
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
