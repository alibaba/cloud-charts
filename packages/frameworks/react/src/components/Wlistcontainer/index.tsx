import React, { useRef, useState, useLayoutEffect } from 'react';
import { Wnumbercard } from '../Wnumbercard/index';
import type { WnumbercardProps } from '../Wnumbercard/index';
import { Wgauge } from '../Wgauge/index';
import type { WgaugeProps } from '../Wgauge/index';
import { Wplaceholder } from '../Wplaceholder/index';

export interface WlistcontainerProps {
  data: Array<WnumbercardProps | WgaugeProps>;
  config?: {
    chart: 'Wnumbercard' | 'Wgauge';
    columns?: number;
    margin?: number | [number, number];
    showDivider?: boolean;
    [key: string]: unknown;
  };
  className?: string;
  style?: React.CSSProperties;
}

const PREFIX = 'cc-wlistcontainer';

export function Wlistcontainer(props: WlistcontainerProps) {
  const { data, config = { chart: 'Wnumbercard' }, className, style } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(400);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) {
    return <Wplaceholder empty />;
  }

  const chart = config.chart || 'Wnumbercard';
  const marginVal = typeof config.margin === 'number' ? config.margin : (Array.isArray(config.margin) ? config.margin[0] : 16);
  const maxWidth = chart === 'Wgauge' ? 96 : 172;
  const columns = config.columns || Math.min(6, Math.max(1, Math.min(Math.floor((width + marginVal) / (maxWidth + marginVal)), data.length)));

  return (
    <div ref={containerRef} className={`cloud-charts ${PREFIX} ${className || ''}`} style={style}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${marginVal}px` }}>
        {data.map((item, i) => {
          const itemWidth = `calc(${100 / columns}% - ${marginVal * (columns - 1) / columns}px)`;
          return (
            <div key={i} style={{ flex: `0 0 ${itemWidth}` }}>
              {chart === 'Wgauge'
                ? <Wgauge {...(item as WgaugeProps)} />
                : <Wnumbercard {...(item as WnumbercardProps)} />
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}
