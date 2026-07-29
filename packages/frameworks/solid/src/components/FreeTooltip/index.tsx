import { For, type JSX } from 'solid-js';

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
  locked?: boolean;
  onLockToggle?: () => void;
  columns?: number;
}

const containerStyle: JSX.CSSProperties = {
  background: '#ffffff',
  'border-radius': '4px',
  'box-shadow': '0 3px 8px 0 rgba(0, 0, 0, 0.18)',
  padding: '12px 0 12px 12px',
  'min-width': '120px',
  'max-width': '400px',
  'font-size': '12px',
  'font-family': "'Helvetica Neue', 'Helvetica', 'PingFang SC', 'Microsoft YaHei', 'Arial', sans-serif",
  color: '#333333',
  'pointer-events': 'auto',
  position: 'relative',
};
const titleStyle: JSX.CSSProperties = {
  'font-weight': 600,
  'margin-bottom': '6px',
  color: '#808080',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'space-between',
  'padding-right': '12px',
};
const listStyle: JSX.CSSProperties = {
  'max-height': '250px',
  'overflow-y': 'auto',
  'padding-right': '12px',
};
const itemStyle: JSX.CSSProperties = {
  display: 'flex',
  'align-items': 'center',
  gap: '8px',
  margin: '4px 0',
  'line-height': '20px',
};
const nameStyle: JSX.CSSProperties = {
  overflow: 'hidden',
  'text-overflow': 'ellipsis',
  'white-space': 'nowrap',
  flex: '1',
  'min-width': '0',
};
const valueStyle: JSX.CSSProperties = {
  'font-weight': 600,
  'margin-left': '12px',
  'font-variant-numeric': 'tabular-nums',
  'flex-shrink': '0',
};
const markerStyle = (color: string): JSX.CSSProperties => ({
  display: 'inline-block',
  width: '6px',
  height: '6px',
  'border-radius': '50%',
  background: color,
  'margin-right': '6px',
  'flex-shrink': '0',
});
const lockIconStyle: JSX.CSSProperties = {
  cursor: 'pointer',
  'line-height': '0',
  'flex-shrink': '0',
  'margin-left': '8px',
  'pointer-events': 'auto',
};
// 与内置 tooltip 一致的 pin/thumbtack SVG 图标
const LOCK_SVG = (
  <svg viewBox="0 0 1024 1024" width="12" height="12">
    <path fill="#999" d="M921.6 391.68l-288-288c-5.12-5.12-11.52-7.68-17.92-7.68s-13.44 2.56-17.92 7.68L497.28 203.52c-5.12 4.48-7.68 11.52-7.68 17.92s2.56 13.44 7.68 17.92l51.84 51.84-241.28 104.32c-3.2 1.28-5.76 3.2-7.68 5.12L202.88 497.92c-10.24 10.24-10.24 26.24 0 36.48l85.76 85.76-185.6 257.92c-8.96 12.8-7.68 30.08 3.2 40.96 6.4 6.4 14.72 9.6 23.04 9.6 6.4 0 12.8-1.92 18.56-5.76l262.4-181.76 81.28 81.28c10.24 10.24 26.24 10.24 36.48 0l96.64-96.64c1.92-1.92 3.84-4.48 5.12-7.68L737.28 480l48 48c5.12 5.12 11.52 7.68 17.92 7.68s13.44-2.56 17.92-7.68L921.6 427.52c5.12-5.12 7.68-11.52 7.68-17.92s-3.2-13.44-7.68-17.92z" />
  </svg>
);
const UNLOCK_SVG = (
  <svg viewBox="0 0 1024 1024" width="12" height="12">
    <path fill="#ccc" d="M920.32 391.68l-288-288c-4.48-5.12-10.88-7.68-17.92-7.68s-13.44 2.56-17.92 7.68L496 203.52c-5.12 5.12-7.68 11.52-7.68 17.92s2.56 13.44 7.68 17.92l51.84 51.84-241.28 104.32c-3.2 1.28-5.76 3.2-7.68 5.12L202.24 497.92c-10.24 10.24-10.24 26.24 0 36.48L288 620.16l-185.6 257.92c-8.96 12.8-7.68 30.08 3.2 40.96 6.4 6.4 14.72 9.6 23.04 9.6 6.4 0 12.8-1.92 18.56-5.76l262.4-181.76 81.28 81.28c10.24 10.24 26.24 10.24 36.48 0l96.64-96.64c1.92-1.92 3.84-4.48 5.12-7.68L736 480l48 48c5.12 5.12 11.52 7.68 17.92 7.68s13.44-2.56 17.92-7.68l100.48-100.48c5.12-5.12 7.68-11.52 7.68-17.92s-2.56-13.44-7.68-17.92z m-117.12 63.36l-51.84-51.84c-5.76-5.76-13.44-7.68-21.12-6.4-7.68 1.28-14.08 6.4-17.28 13.44l-135.04 270.08L508.8 748.8l-72.96-72.96c-8.32-8.32-21.12-9.6-30.72-2.56l-239.36 183.68 188.16-234.24c7.04-9.6 5.76-22.4-2.56-30.72l-76.8-76.8 68.48-68.48 273.92-131.2c7.04-3.2 12.16-9.6 14.08-17.28 1.28-7.68-1.28-16-6.4-21.12l-55.68-55.68 45.44-45.44L848 409.6l-44.8 45.44z" />
  </svg>
);

export function FreeTooltip(props: FreeTooltipProps): JSX.Element | null {
  if (!props.title && (!props.data || props.data.length === 0)) return null;
  let previousDodge: string | undefined;
  const lockIcon = props.locked !== undefined ? (
    <div
      onClick={(e: MouseEvent) => { e.stopPropagation(); props.onLockToggle?.(); }}
      style={lockIconStyle}
    >
      {props.locked ? LOCK_SVG : UNLOCK_SVG}
    </div>
  ) : null;

  const listStyleMerged: JSX.CSSProperties = props.columns && props.columns > 1
    ? { ...listStyle, 'column-count': props.columns, 'column-gap': '8px' }
    : listStyle;

  return (
    <div style={containerStyle}>
      <style>{`.free-tooltip-list::-webkit-scrollbar{width:4px;height:4px}.free-tooltip-list::-webkit-scrollbar-thumb{border-radius:100px;background:#d9d9d9;border:none}.free-tooltip-list::-webkit-scrollbar-track{background:transparent}`}</style>
      {props.title || lockIcon ? (
        <div style={titleStyle}>
          {props.title ? <span>{props.title}</span> : <span />}
          {lockIcon}
        </div>
      ) : null}
      <div className="free-tooltip-list" style={listStyleMerged}>
        <For each={props.data || []}>{(item) => {
          const currentDodge = props.dodge ? item.dodge : undefined;
          const showDodge = Boolean(currentDodge && currentDodge !== previousDodge);
          previousDodge = currentDodge;
          return (
            <div style={itemStyle}>
              {props.dodge ? <span style={{ width: '64px', 'margin-right': '8px', 'flex-shrink': '0' }}>{showDodge ? currentDodge : ''}</span> : null}
              <div style={{ display: 'flex', 'align-items': 'center', flex: '1', 'min-width': '0' }}>
                {item.color ? <span style={markerStyle(item.color)} /> : null}
                <span style={nameStyle} title={item.name}>{item.name}</span>
              </div>
              <span style={valueStyle}>{item.value}</span>
            </div>
          );
        }}</For>
      </div>
    </div>
  );
}
