'use strict';

import * as React from 'react';
import { PrefixName } from '../../constants';

const prefix = `${PrefixName}-wcontainer`;

export default class Divider extends React.PureComponent {
  static displayName = 'Divider';

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className={`${prefix}-divider`} />
    );
  }
}
