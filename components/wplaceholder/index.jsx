'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

const prefix = 'aisc-wplaceholder';
const svg = <svg width="44" height="40" className="placeholder-box">
  <rect className="placeholder-item" width="10" height="25" x="0" y="15" />
  <rect className="placeholder-item" width="10" height="32" x="17" y="8" />
  <rect className="placeholder-item" width="10" height="40" x="34" y="0" />
</svg>;

export default class Wplaceholder extends React.Component {
  render() {
    const { className, height = '100%', style, children, ...otherProps } = this.props;

    const mainClasses = classNames(prefix, {
      [className]: !!className
    });

    return (
      <div className={mainClasses}
           style={{
             height,
             ...style
           }}
           {...otherProps}
      >
        <div className={prefix + '-children'}>
          {svg}
          {children ? <div className={prefix + '-children-text'}>{children}</div> : null}
        </div>
      </div>
    );
  }
}

