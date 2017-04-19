'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import {compareComputed} from '../utils/common';

class BarChartDetailsMini extends React.Component {
  static propTypes = {
    title: React.PropTypes.shape({
      label: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
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
      "label": "Load",
      "key": "title",
    },
    details: [{
      "label": "CPU使用率",
      "key": 'a',
    }, {
      "label": "内存使用率",
      "key": 'b'
    }],
    dataSource:{}
  }

  render() {  
    let title = this.props.title;
    let details = this.props.details;
    let dataSource = this.props.dataSource;

    let titleStatus = '';
    if(title.compare !== undefined && title.key !== undefined && dataSource[title.key] !== undefined){
      titleStatus = classNames({
        "orange-threshold":  (title.orangeThreshold !== undefined && compareComputed(title.compare, dataSource[title.key], title.orangeThreshold)) ? true : false,
        "red-threshold": (title.redThreshold !== undefined  && compareComputed(title.compare, dataSource[title.key], title.redThreshold)) ? true : false,
      })
    }
    
    let thresholds = details.map((item) => {
      let thresholdsClassName = classNames({
        'orange-threshold': (item.orangeThreshold !== undefined && compareComputed(item.compare, dataSource[item.key], item.orangeThreshold)) ? true : false,
        "red-threshold": (item.redThreshold !== undefined  && compareComputed(item.compare, dataSource[item.key], item.redThreshold)) ? true : false
      });
      return thresholdsClassName;
    })
    
    let widths= details.map((item)=>{
      return {width: (dataSource[item.key] || 0) * 100 + '%'};
    })
    
    let titleData = dataSource[title.key] === undefined ?  '-' : dataSource[title.key];
    return (
      <div className="load-progress">
        <div className="load-progress-title">
          <span className="load-progress-title-text">{title.label}</span>
          <span className={`load-progress-title-data ${titleStatus}`}>{titleData.toLocaleString()}</span>
        </div>
        <div className="load-progress-details">
          { 
            details.map((detail, index)=>{
              let data = (Number(dataSource[detail.key]).toFixed(2) * 100);
              data = isNaN(data) ? '-' : data;
              return (
                <div className="load-progress-details-detail" key={index}>
                  <div className="load-progress-details-detail-left">
                    <div className="load-progress-details-detail-text">
                    {detail.label}
                    </div>
                    <div className="load-progress-details-detail-pro-bg">
                      <div className={`load-progress-details-detail-pro ${thresholds[index]}`} style={widths[index]}>
                      </div> 
                    </div>
                  </div>
                  <div className={`load-progress-details-detail-data ${thresholds[index]}`}>
                  {data + '%'}
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

export default BarChartDetailsMini;