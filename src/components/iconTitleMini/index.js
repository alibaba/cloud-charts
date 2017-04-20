'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import { Icon } from '@alife/aisc';
import {compareComputed} from '../utils/common';

class IconTitleMini extends React.Component {
  static propTypes = {
    iconType: React.PropTypes.string,
    iconUrl: React.PropTypes.string,
    iconHtml: React.PropTypes.element,
    title: React.PropTypes.shape({
      label: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
    }),
    dataSource: React.PropTypes.object,
  };
  static defaultProps = {
    
    dataSource: {},
    title: {
      "label": "Load",
      "key": "title"
    },
    iconHtml:  (<Icon type="ais" size="large"/>),
  }

  render() {
    let title = this.props.title || '';
    let iconType = this.props.iconType;
    let iconUrl = this.props.iconUrl;
    let dataSource = this.props.dataSource;
    let icon;
    if(iconType !== undefined){
      icon =  <Icon type={iconType} size="large" />
    }else if(iconUrl !== undefined){
      icon = <img src={iconUrl} width="22" height="22" className='vam'/>
    }else{
      icon = this.props.iconHtml
    }

    let titleStatus = '';
    if(title.compare !== undefined && title.key !== undefined && dataSource[title.key] !== undefined){
      titleStatus = classNames({
        "orange-threshold":  (title.orangeThreshold !== undefined && compareComputed(title.compare, dataSource[title.key], title.orangeThreshold)) ? true : false,
        "red-threshold": (title.redThreshold !== undefined  && compareComputed(title.compare, dataSource[title.key], title.redThreshold)) ? true : false,
      })
    }
    
    let titleData = dataSource[title.key] === undefined ?  '-' : dataSource[title.key];
    
    return (
      <div className="icon-title-mini">
        <div className="icon-title-mini-icon-bg">
          <div className="icon-title-mini-icon">
              {icon}
          </div>
        </div>
        <div className="icon-title-mini-title">
          <div className={`icon-title-mini-title-data healthy ${titleStatus}`}>
            {titleData}
          </div>
          <div className="icon-title-mini-title-text">
            {title.label}
          </div>
        </div>
      </div>
    );
  }
}

export default IconTitleMini;