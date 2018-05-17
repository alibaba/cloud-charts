'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './index.scss';

const prefix = 'aisc-wperline';

export default class Wperline extends React.Component {
  static defaultProps = {
    percent: 0,
    status: ''
  };

  render() {
    const percent = this.props.percent;
    let defaultStyle = { width: `${percent}%` };

    if (percent < 15) {
      defaultStyle = { width: `${percent}%`, 'text-indent': `${percent + 1}%` };
    }

    return (
      <div className={`${prefix} ${prefix}-status-${this.props.status}`}>
        <div className={`${prefix}-num`} style={defaultStyle}>
          <span>{percent}%</span>
        </div>
      </div>
    )
  }
}

Wperline.propTypes = {
  percent: PropTypes.number,
  status: PropTypes.string,
};
