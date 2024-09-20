import React from 'react';
import { PrefixName } from '../../../constants';
import { Types } from '../../../common/types';
import './index.scss';

const Prefix = `${PrefixName}-free-tooltip-`;

interface FreeTooltipProps {
  /** 标题 */
  title?: string;

  /** 数据项 */
  data: Array<{
    /** 名称 */
    name: string;

    /** 数值 */
    value: number;

    /** 颜色 */
    color?: string;
  }>;

  config?: Types.TooltipCfg;
}

export default function Tooltip({ title, data, config }: FreeTooltipProps) {
  if (!title && data?.length === 0) {
    return <div />;
  }

  return (
    <div className={`${Prefix}container`}>
      {title && config?.showTitle && <div className={`${Prefix}title`}>{title}</div>}
      <div className={`${Prefix}items-container`}>
        {(data || []).map((item) => {
          return (
            <div key={item.name} className={`${Prefix}item`}>
              <div className={`${Prefix}name-container`}>
                {item.color && <div className={`${Prefix}marker`} style={{ background: item.color }} />}
                <div className={`${Prefix}name`}>{item.name}</div>
              </div>
              <div className={`${Prefix}value`}>{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
