'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import {compareComputed} from '../utils/common';

class PieChartTitleMini extends React.Component {
  static propTypes = {
    title: React.PropTypes.shape({
      //环文案
      ring: React.PropTypes.string,
      //除数，分子 
      divisor: React.PropTypes.string,
      //被除数，分母
      dividend: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      divisorKey: React.PropTypes.string.isRequired,
      dividendKey: React.PropTypes.string.isRequired
    }),
    details: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
    })),
    dataSource: React.PropTypes.object,
  };
  
  static defaultProps = {
    //默认值
    title: {
      ring: "使用率",
      divisor: "已使用容量",
      dividend: "总容量",
      orangeThreshold : 0.6,
      redThreshold : 0.8,
      compare:">",
      divisorKey: "divisor",
      dividendKey: "dividend"
    },
    details: [{
      "label": "Pools",
      "key": "a"
    }, {
      "label": "rbd",
      "key": "b"
    }, {
      "label": "总PG数",
      "key": "c"
    }, {
      "label": "PG分布标准差",
      "key": "d"
    }],
    dataSource:{}
  }
  
  render() {  
    let title = this.props.title;
    let details = this.props.details;
    let dataSource = this.props.dataSource;
    //计算标题状态
    let titleStatus = '';
    let ratio = 0;
    let circumference = 2 * 38 * Math.PI;
    if(title.compare !== undefined && title.divisorKey !== undefined && title.dividendKey !== undefined && dataSource[title.divisorKey] !== undefined && dataSource[title.dividendKey] !== undefined && dataSource[title.dividendKey] !== 0) {
      let divisor = dataSource[title.divisorKey];
      let dividend = dataSource[title.dividendKey];
      ratio = Number((divisor/dividend).toFixed(2));
      titleStatus = classNames({
        "orange-threshold": (title.orangeThreshold !== undefined && compareComputed(title.compare, ratio, title.orangeThreshold)) ? true : false,
        "red-threshold": (title.redThreshold !== undefined && compareComputed(title.compare, ratio, title.redThreshold)) ? true : false,
      })
    }
    let strokeDasharray = ratio * circumference + ' ' + circumference;
    
    let thresholds = details.map((item) => {
      let thresholdsClassName = classNames("usage-rate-ring-details-detail-data healthy", {
        'orange-threshold': (item.orangeThreshold !== undefined && compareComputed(item.compare, dataSource[item.key], item.orangeThreshold)) ? true : false,
        "red-threshold": (item.redThreshold !== undefined  && compareComputed(item.compare, dataSource[item.key], item.redThreshold)) ? true : false
      });
      return thresholdsClassName;
    })

    return (
      <div className="usage-rate-ring">
        <div className="usage-rate-ring-title">
          <div className="usage-rate-ring-ratio-svg">
            <svg width="100%" height="100%" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" version="1.1" className={`usage-rate-ring-svg ${titleStatus}`}>
              <circle r="38" cx="40" cy="40" className="usage-rate-ring-svg-bg"></circle>
              <circle r="38" cx="40" cy="40" className="usage-rate-ring-svg-ring" strokeDasharray={strokeDasharray} transform="rotate(-90, 40 40)"></circle>
            </svg>
            <div className="usage-rate-ring-count-num">
              <span>{(ratio * 100) + '%'}</span>
              <p>{title.ring}</p>
            </div>
          </div>
          <div className={`usage-rate-ring-divi ${titleStatus}`}>
            <div className="usage-rate-ring-divi-data">
              <span className="usage-rate-ring-divisor">
              {dataSource[title.divisorKey] || '-'}
              </span>
              <span>
              ／
              </span>
              <span className="usage-rate-ring-dividend">
              {dataSource[title.dividendKey] || '-'}
              </span>
            </div>
            <div className="usage-rate-ring-divi-text">
              <span className="usage-rate-ring-divisor">
              {title.divisor}
              </span>
              <span>
              ／
              </span>
              <span className="usage-rate-ring-dividend">
              {title.dividend}
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
                  {dataSource[detail.key] || '-'}
                  </div>
                  <div className="usage-rate-ring-details-detail-text">
                  {detail.label}
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

export default PieChartTitleMini;