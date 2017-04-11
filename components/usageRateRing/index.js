/*
 * @description 使用率 环占比 
 * @param titles object 环文案、占比对象文案、橙色阈值、红色阈值
 * @param titlesData object 占比对象值
 * @param details array 详情：包含文案、数据、阈值
 * 默认值见defaultProps
 * */
'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class UsageRateRing extends React.Component {
  static propTypes = {
    titles: React.PropTypes.shape({
      //环文案
      ring: React.PropTypes.string,
      //除数，分子
      divisor: React.PropTypes.string,
      //被除数，分母
      dividend: React.PropTypes.string,
      orangeThreshold : React.PropTypes.number,
      redThreshold : React.PropTypes.number
    }),
    titlesData: React.PropTypes.shape({
      divisor: React.PropTypes.number,
      dividend: React.PropTypes.number
    }),
    details: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string,
      data: React.PropTypes.number,
      threshold: React.PropTypes.number
    }))
  };
  
  static defaultProps = {
    //默认值
    titles: {
      ring: "使用率",
      divisor: "已使用容量",
      dividend: "总容量",
      //橙色阈值
      orangeThreshold : 0.6,
      //红色阈值
      redThreshold : 0.8
    },
    // Healthy\Unhealthy
    titlesData: {
      divisor: 75,
      dividend: 100
    },
    details: [{
      title: "Pools",
      data: 0
    }, {
      title: "rbd",
      data: 0
    }, {
      title: "总PG数",
      data: 0
    }, {
      title: "PG分布标准差",
      data: 1.23,
      threshold: 1,
    }]
  }
  
  render() {  
    let titles = this.props.titles;
    let titlesData = this.props.titlesData;
    let details = this.props.details;

    let thresholds = details.map((item) => {
      let thresholdsClassName = classNames("usage-rate-ring-details-detail-data", {
        'over-threshold': item.data > item.threshold ? true : false
      });
      return thresholdsClassName;
    })
    let circumference = 2 * 38 * Math.PI;
    let ratio = (titlesData.dividend !== undefined && titlesData.dividend !== null && titlesData.dividend !== 0)? Number((titlesData.divisor/titlesData.dividend).toFixed(2)) : 0;
    let strokeDasharray = ratio * circumference + ' ' + circumference;
    
    let svgThreshold = classNames({
      'usage-rate-ring-orange': ratio >= (titles.orangeThreshold ? titles.orangeThreshold : 1),
      'usage-rate-ring-red': ratio >= (titles.redThreshold ? titles.redThreshold : 1),
    });

    return (
      <div className="usage-rate-ring">
        <div className="usage-rate-ring-title">
          <div className="usage-rate-ring-ratio-svg">
            <svg width="100%" height="100%" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" version="1.1" className={`usage-rate-ring-svg ${svgThreshold}`}>
              <circle r="38" cx="40" cy="40" className="usage-rate-ring-svg-bg"></circle>
              <circle r="38" cx="40" cy="40" className="usage-rate-ring-svg-ring" strokeDasharray={strokeDasharray} transform="rotate(-90, 40 40)"></circle>
            </svg>
            <div className="usage-rate-ring-count-num">
              <span>{(ratio * 100) + '%'}</span>
              <p>{titles.ring}</p>
            </div>
          </div>
          <div className={`usage-rate-ring-divi ${svgThreshold}`}>
            <div className="usage-rate-ring-divi-data">
              <span className="usage-rate-ring-divisor">
              {titlesData.divisor}
              </span>
              <span>
              ／
              </span>
              <span className="usage-rate-ring-dividend">
              {titlesData.dividend}
              </span>
            </div>
            <div className="usage-rate-ring-divi-text">
              <span className="usage-rate-ring-divisor">
              {titles.divisor}
              </span>
              <span>
              ／
              </span>
              <span className="usage-rate-ring-dividend">
              {titles.dividend}
              </span>
            </div>

          </div>
        </div>
        <div className="usage-rate-ring-details">
          { 
            details.map((detail, index)=>{
              return (
                <div className="usage-rate-ring-details-detail" key={index}>
                  <div className={thresholds[index]}>
                  {detail.data}
                  </div>
                  <div className="usage-rate-ring-details-detail-text">
                  {detail.title}
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

export default UsageRateRing;