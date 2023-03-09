import * as React from 'react';
import PercentBar from './percentBar';
import { IProps } from './interface'

const Wcapacity: React.FC<IProps> = ({ data, config, height, style }) => {
  return (
    <div
      className="WaterLine"
      style={{
        height: height || 100,
        ...style
      }}
    >
      <PercentBar
        config={config}
        data={data}
      />
    </div>
  );
};

export default Wcapacity;
