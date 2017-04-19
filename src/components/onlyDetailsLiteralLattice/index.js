'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import {compareComputed} from '../utils/common';

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
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
    })),
    dataSource: React.PropTypes.object,
    onClickHealthy: React.PropTypes.func
  };
  
  static defaultProps = {
    //默认值
    row: 2,
    col: 2,
    details: [{
      "label": "OSD in",
      "key": "a",
    }, {
      "label": "OSD out",
      "key": "b",
    }, {
      "label": "OSD up",
      "key": "c",
    }, {
      "label": "OSD down",
      "key": "d",
    }],
    dataSource: {}  
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

    this.state={
      details: result
    }
  }

  render() {  
    let details = this.state.details;
    let dataSource = this.props.dataSource;

    let thresholds = details.map((item) => {
      let thresholdsClassName = classNames("healthy-status-details-detail-data healthy", {
        'orange-threshold': (item.orangeThreshold !== undefined && compareComputed(item.compare, dataSource[item.key], item.orangeThreshold)) ? true : false,
        "red-threshold": (item.redThreshold !== undefined  && compareComputed(item.compare, dataSource[item.key], item.redThreshold)) ? true : false
      });
      return thresholdsClassName;
    })
    return (
      <div className="only-details-literal-lattice">
        <div className="only-details-literal-lattice-details">
          { 
            details.map((row, i)=>{
              let rowHtml =  row.map((detail, j)=>{
                let thresholdsClassName = classNames("only-details-literal-lattice-details-detail-data healthy", {
                  'orange-threshold': (detail.orangeThreshold !== undefined && compareComputed(detail.compare, dataSource[detail.key], detail.orangeThreshold)) ? true : false,
                  "red-threshold": (detail.redThreshold !== undefined  && compareComputed(detail.compare, dataSource[detail.key], detail.redThreshold)) ? true : false
                });
                return (
                  <div className="only-details-literal-lattice-details-detail" key={detail.key}>
                    <div className={thresholdsClassName}>
                    {dataSource[detail.key] === undefined ?  '-' : dataSource[detail.key]}
                    </div>
                    <div className="only-details-literal-lattice-details-detail-text">
                    {detail.label}
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