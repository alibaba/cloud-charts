/*
 * @description    健康状态
 * @param monitorTitle array 标题、副标题  default ["Status", "Monitors in Quorum"]
 * @param monitorData array 标题、副标题对应值 default ["Healthy", 0]
 * @param detailsTitle array item个数以传入的文案数为准 default ["OSD in","OSD out", "OSD up", "OSD down"]
 * @param detailsData array default ["-", "-", "-", "-"]
 * */
'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

//默认值
const monitorTitle = ["Status", "Monitors in Quorum"];
const monitorData = ["Healthy", 0];
const detailsTitle = ["OSD in","OSD out", "OSD up", "OSD down"];
const detailsData = ["-", "-", "-", "-"];

class HealthyStatus extends React.Component {
  static propTypes = {
    monitorTitle: React.PropTypes.array,
    monitorData: React.PropTypes.array,
    detailsTitle: React.PropTypes.array,
    detailsData: React.PropTypes.array
  };
  
  constructor(props){
    super(props);
  }
  
  onClick(){
    if(this.props.url){
      let win = window.open(this.props.url, '_blank');
      win.focus();
    }
  }
  
  render() {
    let title = this.props.title || 'title';
    let subTitle = this.props.subTitle || 'subTitle';
    let icon = this.props.icon || (<Icon type="ais" />);
    return (
      <div className="react-link" onClick={this.onClick}>
        <div className="react-link-left">
          <div className="react-link-icon">
            {icon}
          </div>
        </div>
        <div className="react-link-right">
          <div className="react-link-title">
            {title}
          </div>
          <div className="react-link-sub-title">
            {subTitle}
          </div>
        </div>
      </div>
    );
  }
}

export default HealthyStatus;