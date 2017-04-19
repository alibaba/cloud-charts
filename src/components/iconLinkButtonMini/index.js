'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import { Icon } from '@alife/aisc';

class IconLinkButtonMini extends React.Component {
  static propTypes = {
    url: React.PropTypes.string,
    icon: React.PropTypes.string,
    title: React.PropTypes.string,
    subTitle: React.PropTypes.string
  };
  static defaultProps = {
    iconHtml:  (<Icon type="ais" size="large"/>)
  }
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
    let title = this.props.title || '';
    let subTitle = this.props.subTitle || '';
    let iconType = this.props.iconType;
    let iconUrl = this.props.iconUrl;
    let icon;
    if(iconType !== undefined){
      icon =  <Icon type={iconType} size="large" />
    }else if(iconUrl !== undefined){
      icon = <img src={iconUrl} width="22" height="22" className='vam'/>
    }else{
      icon = this.props.iconHtml
    }
    let urlClass = classNames({
      "cursor-p": this.props.url !==undefined
    })
    return (
      <div className={`rect-link ${urlClass}`} onClick={this.onClick} >
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

export default IconLinkButtonMini;