import React, { useEffect } from 'react';
import PercentBar from './percentBar';
import { IProps } from './interface';
import { FullCrossName, PrefixName } from '../constants';
import chartLog from '../common/log';

const prefix = `${FullCrossName} ${PrefixName}-wcapacity`;

export type WcapacityProps = IProps;

const Wcapacity: React.FC<IProps> = ({ data, config, height, style }) => {
  useEffect(() => {
    // 图表初始化时记录日志
    chartLog('Wcapacity', 'init');
  }, []);

  return (
    <div
      className={prefix}
      style={{
        height: height || '100%',
        ...style,
      }}
    >
      <PercentBar config={config} data={data} prefix={prefix} />
    </div>
  );
};

export default Wcapacity;
