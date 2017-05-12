'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import {compareComputed} from '../common';

class OnlyDetailsLiteralLattice extends React.Component {
  static propTypes = {
    title: React.PropTypes.shape({
      label: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
    }),
    subTitle: React.PropTypes.shape({
      label: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
    }),
    row: React.PropTypes.oneOf([1,2,3,4,5,6]),
    col: React.PropTypes.oneOf([1,2,3,4,5,6]),
    details: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.string,
      unit: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
      cell: React.PropTypes.func
    })),
    dataSource: React.PropTypes.object,
    onClickHealthy: React.PropTypes.func
  };
  
  static defaultProps = {
    //默认值
    row: 2,
    col: 2,
    details: [{
      "label": "Text",
      "key": "a",
    }, {
      "label": "Text",
      "key": "b",
    }, {
      "label": "Text",
      "key": "c",
    }, {
      "label": "Text",
      "key": "d",
    }],
    dataSource: {}  
  }

  renderCell(value, i, j){
    if(this.state.details[i][j] && this.state.details[i][j].cell){
      return this.state.details[i][j].cell(value);
    }else{
      return value === undefined ? '-' : value.toLocaleString();
    }
  }
  
  constructor(props){
    super(props);
    let details = props.details;
    let row = props.row;
    let col = props.col;
    let result = [];
    for(let i=0,len=details.length;i<len;i+=col){
       result.push(details.slice(i,i+col));
    }
    let rows = Array.apply(null, Array(row)).map(function(item, i) {
        return i;
    });
    let cols = Array.apply(null, Array(col)).map(function(item, i) {
        return i;
    });

    this.state={
      details: result,
      rows: rows,
      cols: cols
    }
  }

  render() {  
    let details = this.state.details;
    let dataSource = this.props.dataSource;
    
    let rows = this.state.rows;
    let cols = this.state.cols;

    return (
      <div className="only-details-literal-lattice">
        <div className="only-details-literal-lattice-details">
          { 
            rows.map((row, i)=>{
              let rowHtml =  cols.map((col, j)=>{
                let detail = details[row][col] || {};
                let thresholdsClassName = "only-details-literal-lattice-details-detail-data healthy";
                if(detail && detail.key){
                  thresholdsClassName = classNames("only-details-literal-lattice-details-detail-data healthy", {
                    'orange-threshold': (detail.orangeThreshold !== undefined && compareComputed(detail.compare, dataSource[detail.key], detail.orangeThreshold)) ? true : false,
                    "red-threshold": (detail.redThreshold !== undefined  && compareComputed(detail.compare, dataSource[detail.key], detail.redThreshold)) ? true : false
                  });
                }
                let data = detail.label===undefined ? '' : dataSource[detail.key];
                return (
                  <div className="only-details-literal-lattice-details-detail" key={j}>
                    <div className={thresholdsClassName}>
                      {this.renderCell(data, i, j)}
                      <span className="only-details-literal-lattice-details-detail-unit">
                        {detail.unit || ''}
                      </span>
                    </div>
                    <div className="only-details-literal-lattice-details-detail-text">
                    {detail.label || ''}
                    </div>
                  </div>
                );
              })
              return (
                <div className='only-details-literal-lattice-details-row' key={i}>
                {rowHtml}
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default OnlyDetailsLiteralLattice;