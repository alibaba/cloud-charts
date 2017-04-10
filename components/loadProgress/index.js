/*
 * @description Load 带进度条的使用率挂件
 * @param titles object 标题以及对应值  
 * @param details array 详情：包含文案、数据、阈值
 * 阈值： 橙色阈值、红色阈值
 * 默认值见defaultProps
 * */
'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class LoadProgress extends React.Component {
  static propTypes = {
    title: React.PropTypes.shape({
      text: React.PropTypes.string,
      data: React.PropTypes.number
    }),
    details: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string,
      data: React.PropTypes.number,
      orangeThreshold: React.PropTypes.number,
      redThreshold: React.PropTypes.number
    }))
  };
  
  static defaultProps = {
    //默认值
    title: {
      text: "Load",
      data: 1234567890,
    },
    details: [{
      title: "CPU使用率",
      data: 1,
      orangeThreshold: 0.6,
      redThreshold: 0.8
    }, {
      title: "内存使用率",
      data: 0.75,
      orangeThreshold: 0.6,
      redThreshold: 0.8
    }]
  }

  render() {  
    let title = this.props.title;
    let details = this.props.details;

    let thresholds = details.map((item) => {
      let thresholdsClassName = classNames({
        'over-threshold-orange': item.data > item.orangeThreshold ? true : false,
        'over-threshold-red': item.data > item.redThreshold ? true : false,
      });
      return thresholdsClassName;
    })
    
    let widths= details.map((item)=>{
      return {width: item.data * 100 + '%'};
    })
    
    let titleData = title.data.toLocaleString();
    return (
      <div className="load-progress">
        <div className="load-progress-title">
          <span className="load-progress-title-text">{title.text}</span>
          <span className="load-progress-title-data">{titleData}</span>
        </div>
        <div className="load-progress-details">
          { 
            details.map((detail, index)=>{
              return (
                <div className="load-progress-details-detail" key={index}>
                  <div className="load-progress-details-detail-left">
                    <div className="load-progress-details-detail-text">
                    {detail.title}
                    </div>
                    <div className="load-progress-details-detail-pro-bg">
                      <div className={`load-progress-details-detail-pro ${thresholds[index]}`} style={widths[index]}>
                      </div> 
                    </div>
                  </div>
                  <div className={`load-progress-details-detail-data ${thresholds[index]}`}>
                  {(detail.data.toFixed(2) * 100) + '%'}
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default LoadProgress;