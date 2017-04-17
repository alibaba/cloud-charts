'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import {compareComputed} from '../utils/common';

class HealthyStatus extends React.Component {
  static propTypes = {
    title: React.PropTypes.shape({
      label: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
    }),
    subTitle: React.PropTypes.shape({
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
    onClickHealthy: React.PropTypes.func
  };
  
  static defaultProps = {
    //默认值
    title: {
      "label": "Status",
      "key": "title"
    },
    subTitle: {
      "label": "Monitors in Quorum",
      "key": "subTitle"
    },    
    details: [{
      "label": "OSD in",
      "key": "a",
    }, {
      "label": "OSD out",
      "key": "b"
    }, {
      "label": "OSD up",
      "key": "c"
    }, {
      "label": "OSD down",
      "key": "d"
    }],
    dataSource: {}  
  }
  
  constructor(props){
    super(props);
    this.onClickHealthy=this.onClickHealthy.bind(this);
  }
  
  onClickHealthy(){
    this.props.onClickHealthy && this.props.onClickHealthy();
  }
  
  render() {  
    let title = this.props.title;
    let subTitle = this.props.subTitle;
    let details = this.props.details;
    let dataSource = this.props.dataSource;
    //计算标题状态
    let titleStatus;
    if(title.compare !== undefined && title.key !== undefined && dataSource[title.key] !== undefined){
      titleStatus = classNames({
        "cursor-p": this.props.onClickHealthy !==undefined,
        "orange-threshold":  (title.orangeThreshold !== undefined && compareComputed(title.compare, dataSource[title.key], title.orangeThreshold)) ? true : false,
        "red-threshold": (title.redThreshold !== undefined  && compareComputed(title.compare, dataSource[title.key], title.redThreshold)) ? true : false,
      })
    }else{
      titleStatus = classNames({
        "cursor-p": this.props.onClickHealthy !==undefined
      })
    }
    
    //计算副标题状态
    let subTitleStatus ='';
    if(subTitle.compare !== undefined && subTitle.key !== undefined && dataSource[subTitle.key] !== undefined){
      subTitleStatus = classNames({
        "cursor-p": this.props.onClickHealthy !==undefined,
        "orange-threshold":  (subTitle.orangeThreshold !== undefined && compareComputed(subTitle.compare, dataSource[subTitle.key], subTitle.orangeThreshold)) ? true : false,
        "red-threshold": (subTitle.redThreshold !== undefined  && compareComputed(subTitle.compare, dataSource[title.key], subTitle.redThreshold)) ? true : false,
      })
    }

    let thresholds = details.map((item) => {
      let thresholdsClassName = classNames("healthy-status-details-detail-data healthy", {
        'orange-threshold': (item.orangeThreshold !== undefined && compareComputed(item.compare, dataSource[item.key], item.orangeThreshold)) ? true : false,
        "red-threshold": (item.redThreshold !== undefined  && compareComputed(item.compare, dataSource[item.key], item.redThreshold)) ? true : false
      });
      return thresholdsClassName;
    })
    return (
      <div className="healthy-status">
        <div className="healthy-status-title">
          <span className="healthy-status-title-text">{title.label}</span>
          <span className={`healthy-status-title-data weight ml12 healthy ${titleStatus}`} onClick={this.onClickHealthy}>{dataSource[title.key] || '-'}</span>
        </div>
        <div className="healthy-status-sub-title">
          <span className="healthy-status-sub-title-text">{subTitle.label}</span>
          <span className={`healthy-status-sub-title-data weight ml12 healthy ${subTitleStatus}`}>{dataSource[subTitle.key] || '-'}</span>
        </div>
        <div className="healthy-status-details">
          { 
            details.map((detail, index)=>{
              return (
                <div className="healthy-status-details-detail" key={index}>
                  <div className={thresholds[index]}>
                  {dataSource[detail.key] || '-'}
                  </div>
                  <div className="healthy-status-details-detail-text">
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

export default HealthyStatus;