'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class RankList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      title: this.props.title,
      data: this.props.data || [],
      cols: this.props.cols
    }
  }

  componentWillReceiveProps (nextProps) {
    if(this.props.data !== nextProps.data){
      this.setState({
        data: nextProps.data || []
      });
    }
    if(this.props.title !== nextProps.title){
      this.setState({
        title: nextProps.title
      });
    }
    if(this.props.cols !== nextProps.cols){
      this.setState({
        cols: nextProps.cols
      });
    }
  }
  
  render() {

    let lis = [];
    let indexMaxNum;
    this.state.data.forEach((item, index)=>{
      let row = [];
      let per = '', indexNum = 0;
      this.state.cols.forEach((col, i)=>{
        let num = item[col.key];
        let text = num.toLocaleString();
        let content = null;
        let cls = '';
        if(col.percent){
          text = (num * 100).toFixed(1) + '%';
          //if(col.isIndex) per = text;
        }
        if(col.suffix) text += col.suffix;
        if(col.cls) cls = 'rank-list-li-' + col.cls;
        if(col.link){
          let link = col.linkKey ? item[col.linkKey] : text;
          content = (<a className={cls} href={col.link + link} target="_blank">{text}</a>)
        }else{
          content = (<span className={cls}>{text}</span>);
        }
        let styleCol = col.width ? {width: col.width + 'px', flexGrow: 0} : {};

        row.push(<div className="rank-list-li-col" style={styleCol} key={'col-' + index + '-' + i}>{content}</div>);

        if(col.isIndex){
          indexNum = num >= 0 ? num : 0;
          if(index === 0) indexMaxNum = num;
        }
        
      });

      if( per === '' ){
        let max = indexMaxNum || item[this.state.cols[0].key];
        per = 100 * indexNum / max + '%';
      }

      lis.push(
        <div className="rank-list-li" key={'li-'+index}>
          {row}
          <div className="rank-list-li-bar" style={{width: per}}></div>
        </div>
      );
    });

    return (
      <div className="rank-list">
        <h5>{this.state.title}</h5>
        <div className="rank-list-ol">
          {lis}
        </div>
      </div>
    );
  }
}

export default RankList;