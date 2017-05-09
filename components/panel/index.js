'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class Panel extends React.Component {
  state = {
    activeKey: this.props.activeKey || ''
  };

  //点击顶部tab
  handleTabClick(key, isActive, e) {
    if (isActive) {
      return;
    }

    this.setState({
      activeKey: key
    });
  }

  renderTab(tabMode, children) {
    if (tabMode) {
      return (
        <div className="p2-panel-tab">
          {
            children.map((child, i) => {
              if (!child) {
                return child;
              }
              const { title, tabKey } = child.props;
              const key = tabKey || title || i;
              const isActive = key === this.state.activeKey || !this.state.activeKey && i === 0;

              const tabCls = classNames('p2-panel-tab-key', {
                'active': isActive
              });

              return <div className={tabCls} key={key} onClick={this.handleTabClick.bind(this, key, isActive)}>{title}</div>
            })
          }
        </div>
      );

    } else {
      return null;
    }
  }

  render() {
    const { children, title, className, tabMode, ...others } = this.props;
    const classes = classNames({
      'p2-panel': true,
      [className]: !!className
    });

    let nodeTitleSub = null;
    let realChildren = [];
    let childrens = Array.isArray(children) ? children : [children];

    childrens.forEach((child)=>{
      if(child.type === PanelTitleSub){
        nodeTitleSub = child;
      }else{
        realChildren.push(child);
      }
    });

    let nodeTitle = null;
    if(title) {
      nodeTitle = (
        <h4>
          <span className="p2-panel-title">{title}</span>
          {this.renderTab(tabMode, realChildren)}
          {nodeTitleSub}
        </h4>
      );

      if (tabMode) {
        realChildren = realChildren.filter((child, i) => {
          if (!child) {
            return child;
          }
          const { title, tabKey } = child.props;
          const key = tabKey || title || i;

          return key === this.state.activeKey || !this.state.activeKey && i === 0;
        });
      }
    }

    let containerCls = 'p2-panel-container';
    if(realChildren.length) containerCls += ' p2-panel-share-' + realChildren.length;

    return (
      <div className={classes}>
        {nodeTitle}
        <div className={containerCls}>
          {realChildren}
        </div>
      </div>
    );
  }
}

class PanelItem extends React.Component {
  static displayName = 'PanelItem';

  render() {
    const { children, className, ...others } = this.props;
    const classes = classNames({
      'p2-panel-item': true,
      [className]: !!className
    });
    return (
      <div className={classes} {...others}>{children}</div>
    );
  }
}

class PanelTitleSub extends React.Component {
  static displayName = 'PanelTitleSub';

  render() {
    const { children, className, ...others } = this.props;
    const classes = classNames({
      'p2-panel-titlesub': true,
      [className]: !!className
    });
    return (
      <div className={classes} {...others}>{children}</div>
    );
  }
}

Panel.Item = PanelItem;
Panel.TitleSub = PanelTitleSub;

export default Panel;