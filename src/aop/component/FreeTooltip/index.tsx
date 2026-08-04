import React, { useMemo, useState } from 'react';
import { PrefixName } from '../../../constants';
import './index.scss';

const Prefix = `${PrefixName}-free-tooltip-`;

/** 排序方式：不排序 / 升序 / 降序 */
type SortOrder = 'none' | 'asc' | 'desc';

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

    data?: any;
  }>;
}

/** 排序箭头图标，上下箭头可分别点击，点击当前激活方向则取消排序 */
function SortIcon({ order, onChange }: { order: SortOrder; onChange: (order: SortOrder) => void }) {
  const upActive = order === 'asc';
  const downActive = order === 'desc';

  return (
    <svg width="10" height="14" viewBox="0 0 10 14" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 0L9 5H1L5 0Z"
        fill="currentColor"
        fillOpacity={upActive ? 1 : 0.3}
        onClick={() => onChange(upActive ? 'none' : 'asc')}
      />
      <path
        d="M5 14L1 9H9L5 14Z"
        fill="currentColor"
        fillOpacity={downActive ? 1 : 0.3}
        onClick={() => onChange(downActive ? 'none' : 'desc')}
      />
    </svg>
  );
}

export default function Tooltip({ title, data }: FreeTooltipProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

  const sortable = (data || []).length > 1;

  const sortedData = useMemo(() => {
    const list = data || [];
    if (!sortable || sortOrder === 'none') {
      return list;
    }
    return [...list].sort((a, b) => (sortOrder === 'asc' ? a.data.y - b.data.y : b.data.y - a.data.y));
  }, [data, sortOrder, sortable]);

  if (!title && data?.length === 0) {
    return <div />;
  }

  return (
    <div className={`${Prefix}container`}>
      {(title || sortable) && (
        <div className={`${Prefix}header`}>
          {title ? <div className={`${Prefix}title`}>{title}</div> : <div />}
          {sortable && (
            <div className={`${Prefix}sort`}>
              <SortIcon order={sortOrder} onChange={setSortOrder} />
            </div>
          )}
        </div>
      )}
      <div className={`${Prefix}items-container`}>
        {sortedData.map((item) => {
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
