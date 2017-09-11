'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const prefix = 'aisc-wcontainer'

export default class Divider extends React.Component {
  constructor(props) {
    super(props);
  }

  static displayName = 'Divider';

  render() {
    return (
      <div className={`${prefix}-divider`}></div>
    );
  }
}
