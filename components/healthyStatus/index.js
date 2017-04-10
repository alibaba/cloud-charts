/*
 * @description 健康状态 
 * @param titles object 标题、副标题  
 * @param titlesData object 标题、副标题对应值  标题值可点击
 * @param details array 详情：包含文案、数据
 * @param healthy func 点击标题值
 * 默认值见defaultProps
 * */
'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class HealthyStatus extends React.Component {
  static propTypes = {
    titles: React.PropTypes.shape({
      title: React.PropTypes.string,
      subTitle: React.PropTypes.string
    }),
    titlesData: React.PropTypes.shape({
      title: React.PropTypes.string,
      subTitle: React.PropTypes.number
    }),
    details: React.PropTypes.arrayOf(React.PropTypes.shape({
      title: React.PropTypes.string,
      data: React.PropTypes.number,
      threshold: React.PropTypes.number
    })),
    healthy: React.PropTypes.func
  };
  
  static defaultProps = {
    //默认值
    titles: {
      title: "Status",
      subTitle: "Monitors in Quorum",
    },
    // Healthy\Unhealthy
    titlesData: {
      title: "Healthy",
      subTitle: 0
    },
    details: [{
      title: "OSD in",
      data: 0
    }, {
      title: "OSD out",
      data: 0
    }, {
      title: "OSD up",
      data: 0
    }, {
      title: "OSD down",
      data: 110,
      threshold: 10,
    }]
  }
  
  constructor(props){
    super(props);
    this.healthy=this.healthy.bind(this);
  }
  
  healthy(){
    this.props.healthy && this.props.healthy();
  }
  
  render() {  
    let titles = this.props.titles;
    let titlesData = this.props.titlesData;
    let details = this.props.details;

    let healthyStatus = classNames("healthy-status-title-data", "weight", "ml12", {
      'healthy': titlesData.title == 'Healthy',
    });
    let thresholds = details.map((item) => {
      let thresholdsClassName = classNames("healthy-status-details-detail-data", {
        'over-threshold': item.data > item.threshold ? true : false
      });
      return thresholdsClassName;
    })
    return (
      <div className="healthy-status">
        <div className="healthy-status-title">
          <span className="healthy-status-title-text" onClick={this.healthy}>{titles.title}</span>
          <span className={healthyStatus}>{titlesData.title}</span>
        </div>
        <div className="healthy-status-sub-title">
          <span className="healthy-status-sub-title-text">{titles.subTitle}</span>
          <span className="healthy-status-sub-title-data weight ml12 healthy">{titlesData.subTitle}</span>
        </div>
        <div className="healthy-status-details">
          { 
            details.map((detail, index)=>{
              return (
                <div className="healthy-status-details-detail" key={index}>
                  <div className={thresholds[index]}>
                  {detail.data}
                  </div>
                  <div className="healthy-status-details-detail-text">
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

export default HealthyStatus;