import React from 'react';
import { PrefixName } from '../../constants';
import './index.scss';

interface LoadingProps {
  text: string;
}

const prefix = PrefixName;

export default class Wcircle extends React.Component<LoadingProps> {
  render() {
    const { text } = this.props;
    return (
      <div className={`${prefix}-loading`}>
        <div className={`${prefix}-loading-right-tip`}>
          <div className={`${prefix}-loading-indicator`}>
            <div className={`${prefix}-loading-fusion-reactor`}>
              <span className={`${prefix}-loading-dot`}></span>
              <span className={`${prefix}-loading-dot`}></span>
              <span className={`${prefix}-loading-dot`}></span>
              <span className={`${prefix}-loading-dot`}></span>
            </div>
          </div>
          <div className={`${prefix}-loading-tip-content`}>{text || ''}</div>
        </div>
      </div>
    );
  }
}
