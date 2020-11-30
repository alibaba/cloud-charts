'use strict';

import React from 'react';
import { PrefixName } from '../../constants';

const prefix = `${PrefixName}-wcontainer`;

export default class Divider extends React.Component {
  constructor(props) {
    super(props);
  }

  static displayName = 'Divider';

  render() {
    return (
      <div className={`${prefix}-divider`} />
    );
  }
}
