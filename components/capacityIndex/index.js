'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class CapacityIndex extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      title: this.props.title,
      ratio: this.props.data.ratio || 0,
      quantity: this.props.data.quantity || 0,
      capacity: this.props.data.capacity || 0
    }
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.data !== nextProps.data){
      this.setState({
        ratio: nextProps.data.ratio || 0,
        quantity: nextProps.data.quantity || 0,
        capacity: nextProps.data.capacity || 0
      });
    }
    if(this.props.title !== nextProps.title){
      this.setState({
        title: nextProps.title
      });
    }
  }
  
  render() {

    let circumference = 2 * 47 * Math.PI;
    let strokeDasharray = this.state.ratio * circumference + ' ' + circumference;

    let clsSvg = classNames({
      'capacity-index-svg': true,
      'capacity-index-warn': this.state.ratio >= 0.8
    });

    return (
      <div className="capacity-index">
        <h5>{this.state.title}</h5>
        <div className="capacity-index-ratio">
          <div className="capacity-index-ratio-svg">
            <svg width="100%" height="100%" viewBox="0 0 106 106" xmlns="http://www.w3.org/2000/svg" version="1.1" className={clsSvg}>
              <circle r="47" cx="53" cy="53" className="capacity-index-svg-bg"></circle>
              <circle r="47" cx="53" cy="53" className="capacity-index-svg-ring"     strokeDasharray={strokeDasharray} transform="rotate(-90, 53 53)"></circle>
            </svg>
          </div>
          <div className="state-index-count-num">
            <span>{(this.state.ratio * 100).toFixed(0) + '%'}</span>
            <p>存储使用率</p>
          </div>
        </div>
        <div className="capacity-index-sub">
          <div className="capacity-index-sub-item">
            <b>机器数</b>
            <span>{this.state.quantity.toLocaleString()}</span>
          </div>
          <div className="capacity-index-sub-item">
            <b>存储容量</b>
            <span>{this.state.capacity.toLocaleString() + 'T'}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CapacityIndex;