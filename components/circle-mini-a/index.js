'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class CircleMiniA extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    ringTitle: React.PropTypes.string,
    ringKey: React.PropTypes.string,
    details: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.string,
      key: React.PropTypes.string.isRequired,
      cell: React.PropTypes.func
    })),
    dataSource: React.PropTypes.object
  };

  // constructor(props){
  //   super(props);
  //   this.state = {
  //     title: this.props.title,
  //     ratio: this.props.data.ratio || 0,
  //     quantity: this.props.data.quantity || 0,
  //     capacity: this.props.data.capacity || 0
  //   }
  // }
  //
  // componentWillReceiveProps (nextProps) {
  //   if(this.props.data !== nextProps.data){
  //     this.setState({
  //       ratio: nextProps.data.ratio || 0,
  //       quantity: nextProps.data.quantity || 0,
  //       capacity: nextProps.data.capacity || 0
  //     });
  //   }
  //   if(this.props.title !== nextProps.title){
  //     this.setState({
  //       title: nextProps.title
  //     });
  //   }
  // }
  
  render() {
    const dataSource = this.props.dataSource || {};
    let ratio = Number(dataSource[this.props.ringKey || 'ratio']);
    if (isNaN(ratio) || !isFinite(ratio)) {
      ratio = 0;
    }

    let circumference = 2 * 47 * Math.PI;
    let strokeDasharray = ratio * circumference + ' ' + circumference;

    let clsSvg = classNames({
      'capacity-index-svg': true,
      'capacity-index-warn': ratio >= 0.8
    });

    return (
      <div className="capacity-index">
        <h5>{this.props.title}</h5>
        <div className="capacity-index-ratio">
          <div className="capacity-index-ratio-svg">
            <svg width="100%" height="100%" viewBox="0 0 106 106" xmlns="http://www.w3.org/2000/svg" version="1.1" className={clsSvg}>
              <circle r="47" cx="53" cy="53" className="capacity-index-svg-bg"></circle>
              <circle r="47" cx="53" cy="53" className="capacity-index-svg-ring" strokeDasharray={strokeDasharray} transform="rotate(-90, 53 53)"></circle>
            </svg>
          </div>
          <div className="state-index-count-num">
            <span>{Math.round(ratio * 100) + '%'}</span>
            <p>{this.props.ringTitle}</p>
          </div>
        </div>
        <div className="capacity-index-sub">
          {
            this.props.details.map((detail, i) => {
              let data = dataSource[detail.key];
              if (detail.cell) {
                data = detail.cell(data);
              } else {
                data = Number(data);
                if (isNaN(data) || !isFinite(data)) {
                  data = '-';
                } else {
                  data = data.toLocaleString();
                }
              }

              return (
                <div className="capacity-index-sub-item">
                  <b>{detail.label}</b>
                  <span>{data}</span>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default CircleMiniA;