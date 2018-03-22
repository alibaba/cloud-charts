'use strict';

import React from 'react';
import classNames from 'classnames';
import './index.scss';

const prefix = 'aisc-wplaceholder';
const svg = <svg width="44" height="40" className="placeholder-box">
  <rect className="placeholder-item item-1" width="10" height="20" x="0" y="20" />
  <rect className="placeholder-item item-2" width="10" height="26" x="17" y="14" />
  <rect className="placeholder-item item-3" width="10" height="32" x="34" y="8" />
</svg>;

export default class Wplaceholder extends React.Component {
  render() {
    const { className, height = '100%', style, loading, error, children, ...otherProps } = this.props;

    const mainClasses = classNames(prefix, {
      [prefix + '-loading']: !!loading,
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

