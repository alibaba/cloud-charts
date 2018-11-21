'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dashboard from './dashboard';
// import { filterKey } from "../common/common";
import './index.scss';
// import chartLog from "../common/log";

const prefix = 'aisc-wdashboard';


const defaultConfig = {

};

export default class Wdashboard extends React.Component {
  static displayName = 'Wdashboard';

  static defaultProps = {
    range:[0,100],
    pointCount: 5,
  };

  constructor(props) {
    super(props);

  }


  componentDidMount() {
    const { data: data, ...options } = this.props;
    if (!this.dom) {
      return;
    }
    this.dashboard = new Dashboard(this.dom, Object.assign({},defaultConfig,options));
    this.dashboard.setData(data)
  }

  componentWillReceiveProps(nextProps) {
    const { data: newData, config: newOptions } = nextProps;
    const { data: oldData, config: oldOptions } = this.props;
    // console.log(newData, oldData, this.dashboard)
    if (newOptions != oldOptions) {
      this.dashboard.setOption(Object.assign({},defaultConfig,newOptions))
    } else if (newData !== oldData && this.dashboard) {
      console.log(newData)
      this.dashboard.setData(newData)
    }
  }

  componentWillUnmount() {

  }



  render() {
    const { className, ...otherProps } = this.props;

    const mainClasses = classNames({
      [prefix]: true,
      [className]: !!className
    });

    return (
      <div className={`doa-dashoboard-out`}>
        <div ref={s => (this.dom = s)} className={mainClasses}/>
      </div>
    );
  }
}

Wdashboard.propTypes = {
  range: PropTypes.array, //取值范围
  pointCount: PropTypes.number, // 刻度个数
};
