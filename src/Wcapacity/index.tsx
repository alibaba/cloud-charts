import * as React from 'react';
import PercentBar from './percentBar';
import { IProps } from './interface';
import { FullCrossName, PrefixName } from '../constants';

const prefix = `${FullCrossName} ${PrefixName}-wcapacity`;

const Wcapacity: React.FC<IProps> = ({ data, config, height, style }) => {
  return (
    <div
      className={prefix}
      style={{
        height: height || 100,
        ...style
      }}
    >
      <PercentBar
        config={config}
        data={data}
        prefix={prefix}
      />
    </div>
  );
};

export default Wcapacity;
