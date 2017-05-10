'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class StateIndex extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      title: this.props.title,
      total: this.props.data.total || 0,
      down: this.props.data.down || 0,
      out: this.props.data.out || 0
    }
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.data !== nextProps.data){
      this.setState({
        total: nextProps.data.total || 0,
        down: nextProps.data.down || 0,
        out: nextProps.data.out || 0
      });
    }
    if(this.props.title !== nextProps.title){
      this.setState({
        title: nextProps.title
      });
    }
  }
  
  render() {

    let clsDown = classNames({
      'state-index-sub-item': true,
      'state-index-sub-warn': this.state.down > 0
    });

    let clsOut = classNames({
      'state-index-sub-item': true,
      'state-index-sub-warn': this.state.out > 0
    });

    return (
      <div className="state-index">
        <h5>{this.state.title}</h5>
        <div className="state-index-count">
          <div className="state-index-count-num">
            <span>{this.state.total.toLocaleString()}</span>
            <b>个</b>
          </div>
          <div className="state-index-count-sub">OSD数</div>
        </div>
        <div className="state-index-sub">
          <div className={clsDown}>
            <div className="state-index-sub-item-box">
              <b>OSD Down</b>
              <span>{this.state.down.toLocaleString()}</span>
            </div>
          </div>
          <div className={clsOut}>
            <div className="state-index-sub-item-box">
              <b>OSD Out</b>
              <span>{this.state.out.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StateIndex;