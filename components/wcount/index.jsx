'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CountUp from './lib/CountUp';
import { filterKey } from "../common/common";
import './index.scss';

const prefix = 'aisc-wcount';

const checkKey = ['start', 'decimals', 'duration', 'useEasing', 'useGrouping', 'separator', 'decimal', 'placeholder'];
function configChange(a, b) {
  return checkKey.some((key) => {
    return a[key] !== b[key];
  });
}

export default class Wcircle extends React.Component {
  static displayName = 'Wcount';

  static defaultProps = {
    // 常用
    start: 0,
    end: 0,
    decimals: 0,
    duration: 1.5,
    // 额外配置
    useEasing: true, // toggle easing
    useGrouping: true, // 1,000,000 vs 1000000
    separator: ',', // character to use as a separator
    decimal: '.', // character to use as a decimal
    placeholder: "-", // 非数据时的替换
  };

  dom = null;
  countUp = null;

  componentDidMount() {
    if (!this.dom) {
      return;
    }

    this.createCountUp(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { /*start: newStart,*/ end: newEnd, /*decimals: newDecimals, duration: newDuration,*/ ...newOptions } = nextProps;
    const { /*start: oldStart,*/ end: oldEnd, /*decimals: oldDecimals, duration: oldDuration,*/ ...oldOptions } = this.props;

    // 大部分配置项如果改变了，直接生成新的实例
    if (configChange(newOptions, oldOptions)) {
      this.createCountUp(nextProps);
    } else if (newEnd !== oldEnd && this.countUp) {
      // 如果只有 end 改变了，直接update
      this.countUp.update(newEnd);
    }
  }

  createCountUp(props) {
    const { start, end, decimals, duration, ...options } = props;
    const countUp = new CountUp(this.dom, start, end, decimals, duration, options);
    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }

    this.countUp = countUp;
  }

  render() {
    const { className, ...otherProps } = this.props;

    const mainClasses = classNames({
      [prefix]: true,
      [className]: !!className
    });

    return (
      <span ref={s => (this.dom = s)} className={mainClasses} {...filterKey(otherProps, checkKey.concat('end'))} />
    );
  }
}

Wcircle.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  decimals: PropTypes.number,
  duration: PropTypes.number,
  useEasing: PropTypes.bool,
  useGrouping: PropTypes.bool,
  separator: PropTypes.string,
  decimal: PropTypes.string,
  placeholder: PropTypes.string,
};
