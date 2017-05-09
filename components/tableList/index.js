'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

class TableList extends React.Component {

  constructor(props){
    super(props);
    this.state = {
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
    if(this.props.cols !== nextProps.cols){
      this.setState({
        cols: nextProps.cols
      });
    }
  }
  
  render() {

    // let ths = [];
    // this.state.cols.forEach((col, i)=>{
    //   ths.push(<th key={'th-' + i}>{col.name}</th>);
    // });

    let ths = [],tds = [];
    ths.init = false;
    this.state.data.forEach((item, index)=>{
      let row = [];
      this.state.cols.forEach((col, i)=>{
        let num = item[col.key];
        let text = num.toLocaleString();
        let content = null;
        if(col.percent) text = (num * 100).toFixed(1) + '%';//如果是百分比则不走寻常路
        if(col.suffix) text += col.suffix;
        if(col.link){
          let link = col.linkKey ? item[col.linkKey] : text;
          content = (<a href={col.link + link} target="_blank">{text}</a>)
        }else{
          let clsText = '';
          if(!isNaN(col.morethan) && num >= col.morethan) clsText = 'table-list-warn';
          if(!isNaN(col.lessthan) && num <= col.lessthan) clsText = 'table-list-warn';
          content = (<span className={clsText}>{text}</span>);
        }

        let clsTd = isNaN(num) ? 'table-list-txt' : 'table-list-num';
        let styleTd = col.width ? {width: col.width / 11.9 + '%'} : {};
        row.push(<td className={clsTd} style={styleTd} key={'td-'+index+'-'+i}>{content}</td>);

        if(!ths.init) ths.push(<th className={clsTd} style={styleTd} key={'th-' + i}>{col.name}</th>)
      });
      tds.push(<tr key={'tr-'+index}>{row}</tr>);
      ths.init = true;
    });

    return (
      <table className="table-list">
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>
          {tds}
        </tbody>
      </table>
    );
  }
}

export default TableList;