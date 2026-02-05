import React from 'react';
import { PrefixName } from '../../../constants';
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
}

export default function Tooltip({ title, data }: FreeTooltipProps) {
  if (!title && data?.length === 0) {
    return <div />;
  }

  return (
    <div className={`${Prefix}container`}>
      {title && <div className={`${Prefix}title`}>{title}</div>}
      <div className={`${Prefix}items-container`} style={{ maxHeight: title ? 'calc(100% - 26px)' : '100%' }}>
        {(data || []).map((item) => {
          return (
            <div key={item.name} className={`${Prefix}item`}>
              <div className={`${Prefix}name-container`}>
                {item.color && <div className={`${Prefix}marker`} style={{ background: item.color }} />}
                <div className={`${Prefix}name`} style={{ width: item.color ? 'calc(100% - 10px)' : '100%' }}>
                  {item.name}
                </div>
              </div>
              <div className={`${Prefix}value`}>{item.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
