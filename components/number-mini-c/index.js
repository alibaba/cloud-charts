'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class NumberMiniC extends React.Component {

  // constructor(props){
  //   super(props);
  //   this.state = {
  //     title: this.props.title,
  //     total: this.props.data.total || 0,
  //     down: this.props.data.down || 0,
  //     out: this.props.data.out || 0
  //   }
  // }
  //
  // componentWillReceiveProps (nextProps) {
  //   if(this.props.data !== nextProps.data){
  //     this.setState({
  //       total: nextProps.data.total || 0,
  //       down: nextProps.data.down || 0,
  //       out: nextProps.data.out || 0
  //     });
  //   }
  //   if(this.props.title !== nextProps.title){
  //     this.setState({
  //       title: nextProps.title
  //     });
  //   }
  // }
  
  render() {
    const dataSource = this.props.dataSource || {};
    let main = Number(dataSource[this.props.mainKey || 'main']);
    if (isNaN(main) || !isFinite(main)) {
      main = '-';
    } else {
      main = main.toLocaleString();
    }

    // let clsDown = classNames({
    //   'state-index-sub-item': true,
    //   'state-index-sub-warn': this.state.down > 0
    // });
    //
    // let clsOut = classNames({
    //   'state-index-sub-item': true,
    //   'state-index-sub-warn': this.state.out > 0
    // });

    return (
      <div className="state-index">
        <h5>{this.props.title}</h5>
        <div className="state-index-count">
          <div className="state-index-count-num">
            <span>{main}</span>
            <b>{this.props.mainUnit}</b>
          </div>
          <div className="state-index-count-sub">{this.props.mainTitle}</div>
        </div>
        <div className="state-index-sub">
          {
            this.props.details.map((detail, i) => {
              let data = dataSource[detail.key];
              let hasWarn = false;
              if (detail.cell) {
                data = detail.cell(data);
              } else {
                data = Number(data);
                if (isNaN(data) || !isFinite(data)) {
                  data = '-';
                } else {
                  if (data > 0) {
                    hasWarn = true;
                  }
                  data = data.toLocaleString();
                }
              }

              const cls = classNames('state-index-sub-item', {
                'state-index-sub-warn': hasWarn
              });

              return (
                <div className={cls}>
                  <div className="state-index-sub-item-box">
                    <b>{detail.label}</b>
                    <span>{data}</span>
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

export default NumberMiniC;