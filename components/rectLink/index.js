/*
 * @description    具有icon的跳转卡片
 * @param url      跳转地址
 * @param icon     icon html eg:<i class="next-icon next-icon-server"></i>
 * @param title    标题
 * @param subTitle 副标题
 * */
'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import { Icon } from '@alife/aisc/build/aisc';

class RectLink extends React.Component {
  static propTypes = {
    url: React.PropTypes.string,
    icon: React.PropTypes.string,
    title: React.PropTypes.string,
    subTitle: React.PropTypes.string
  };
  
  constructor(props){
    super(props);
    this.onClick=this.onClick.bind(this);
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
    let icon = this.props.icon || (<Icon type="ais" size="large"/>);
    return (
      <div className="rect-link" onClick={this.onClick}>
        <div className="rect-link-left">
          <div className="rect-link-icon">
            {icon}
          </div>
        </div>
        <div className="rect-link-right">
          <div className="rect-link-title overflow-ellipsis">
            {title}
          </div>
          <div className="rect-link-sub-title overflow-ellipsis">
            {subTitle}
          </div>
        </div>
      </div>
    );
  }
}

export default RectLink;