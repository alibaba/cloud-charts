import React from 'react';

export interface FreeTooltipItem {
  name: string;
  value: number | string;
  color?: string;
  dodge?: string;
}

export interface FreeTooltipProps {
  title?: string;
  data: FreeTooltipItem[];
  dodge?: boolean;
}

const containerStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.96)',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 4,
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  padding: '8px 12px',
  minWidth: 120,
  fontSize: 12,
  color: '#333',
  pointerEvents: 'auto',
};
const titleStyle: React.CSSProperties = { fontWeight: 600, marginBottom: 6, color: '#666' };
const itemStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 };
const markerStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: color,
  marginRight: 6,
});

/**
 * FreeTooltip：旧 src/aop/component/FreeTooltip 的 framework-agnostic 移植。
 * 不依赖项目内部 SCSS，所有样式 inline，便于通过 ReactDOM portal / createRoot 渲染到 document.body。
 */
export function FreeTooltip({ title, data, dodge }: FreeTooltipProps): JSX.Element | null {
  if (!title && (!data || data.length === 0)) return null;
  let previousDodge: string | undefined;
  return (
    <div style={containerStyle}>
      {title ? <div style={titleStyle}>{title}</div> : null}
      <div>
        {(data || []).map((item, index) => {
          const currentDodge = dodge ? item.dodge : undefined;
          const showDodge = Boolean(currentDodge && currentDodge !== previousDodge);
          previousDodge = currentDodge;
          return (
            <div key={`${item.name}-${index}`} style={itemStyle}>
              {dodge ? <span style={{ width: 64, marginRight: 8 }}>{showDodge ? currentDodge : ''}</span> : null}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {item.color ? <span style={markerStyle(item.color)} /> : null}
                <span>{item.name}</span>
              </div>
              <span style={{ marginLeft: 12 }}>{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
