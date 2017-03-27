'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class Pannel extends React.Component {

  render() {
    const { children, title, className, ...others } = this.props;
    const classes = classNames({
      'p2-pannel': true,
      [className]: !!className
    });

    let nodeTitleSub = null;
    let realChildren = [];
    let childrens = Array.isArray(children) ? children : [children]

    childrens.forEach((child)=>{
      if(child.type === PannelTitleSub){
        nodeTitleSub = child;
      }else{
        realChildren.push(child);
      }
    });
    
    let nodeTitle = null;
    if(title) nodeTitle = (<h4>{title}{nodeTitleSub}</h4>);
    
    return (
      <div className={classes}>
        {nodeTitle}
        <div className="p2-pannel-container">
          {realChildren}
        </div>
      </div>
    );
  }
}

class PannelItem extends React.Component {

  render() {
    const { children, className, ...others } = this.props;
    const classes = classNames({
      'p2-pannel-item': true,
      [className]: !!className
    });
    return (
      <div className={classes} {...others}>{children}</div>
    );
  }
}

class PannelTitleSub extends React.Component {

  render() {
    const { children, className, ...others } = this.props;
    const classes = classNames({
      'p2-pannel-titlesub': true,
      [className]: !!className
    });
    return (
      <div className={classes} {...others}>{children}</div>
    );
  }
}

Pannel.Item = PannelItem;
Pannel.TitleSub = PannelTitleSub;

export default Pannel;