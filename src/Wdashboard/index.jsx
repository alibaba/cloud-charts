'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Dashboard from './dashboard';
import './index.scss';
import chartLog from "../common/log";

const prefix = 'cloud-wdashboard';

export default class Wdashboard extends React.Component {
  static displayName = 'Wdashboard';

  // static defaultProps = {
  //   range: [0, 100],
  //   pointCount: 6,
  // };

  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wdashboard', 'init');
  }


  componentDidMount() {
    const { data, config } = this.props;
    if (!this.dom) {
      return;
    }
    this.dashboard = new Dashboard(this.dom, Object.assign({}, config));
    this.dashboard.setData(data)
  }

  componentDidUpdate(prevProps) {
    const { data: newData, config: newOptions } = this.props;
    const { data: oldData, config: oldOptions } = prevProps;

    if (newOptions !== oldOptions) {
      this.dashboard.setOption(Object.assign({}, newOptions))
    }
    if (newData !== oldData && this.dashboard) {
      this.dashboard.setData(newData)
    }
  }

  render() {
    const { className, ...otherProps } = this.props;

    const mainClasses = classNames({
      'cloud-charts': true,
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

// Wdashboard.propTypes = {
//   range: PropTypes.array, //取值范围
//   pointCount: PropTypes.number, // 刻度个数
// };
