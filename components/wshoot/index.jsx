'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// 暂时无需样式
// import './index.scss';

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
    const { className } = this.props;

    const mainClasses = classNames({
      [`${prefix}`]: true,
      [className]: !!className
    });

    return (
      <canvas className={mainClasses} ref={(c) => this.canvas = c} />
    );
  }
}
