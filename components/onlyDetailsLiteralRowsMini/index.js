'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';
import {compareComputed} from '../common';

class OnlyDetailsLiteralRowsMini extends React.Component {
  static propTypes = {
    details: React.PropTypes.arrayOf(React.PropTypes.shape({
      label: React.PropTypes.string,
      unit: React.PropTypes.string,
      orangeThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      redThreshold: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
      compare: React.PropTypes.oneOf(['<', '<=', '>', '>=', '==', '===', '!=', '!==']),
      key: React.PropTypes.string.isRequired,
    })),
    dataSource: React.PropTypes.object,
  };
  
  static defaultProps = {
    details: [{
      "label": "Text",
      "unit":"unit",
      "key": "a",
    }, {
      "label": "Text",
      "unit":"unit",
      "key": "b",
    }],
    dataSource: {}  
  }

  render() {  
    let details = this.props.details;
    let dataSource = this.props.dataSource;

    return (
      <div className="only-details-literal-rows-mini">
        <div className="only-details-literal-rows-mini-details">
          { 
            details.map((detail, i)=>{
              let thresholdsClassName = classNames("only-details-literal-rows-mini-details-detail-data healthy", {
                'orange-threshold': (detail.orangeThreshold !== undefined && compareComputed(detail.compare, dataSource[detail.key], detail.orangeThreshold)) ? true : false,
                "red-threshold": (detail.redThreshold !== undefined  && compareComputed(detail.compare, dataSource[detail.key], detail.redThreshold)) ? true : false
              });

              return (
                <div className="only-details-literal-rows-mini-details-detail" key={detail.key}>
                  <div className={thresholdsClassName}>
                    {dataSource[detail.key] === undefined ?  '-' : dataSource[detail.key]}
                    <span className="only-details-literal-rows-mini-details-detail-unit">
                      {detail.unit || ''}
                    </span>
                  </div>
                  <div className="only-details-literal-rows-mini-details-detail-text">
                    {detail.label}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default OnlyDetailsLiteralRowsMini;