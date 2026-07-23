import React, { useRef, useLayoutEffect } from 'react';
import { createGaugeElement } from '@alicloud/cloud-charts-core';
import type { CreateGaugeOptions } from '@alicloud/cloud-charts-core';

export interface WgaugeProps extends Omit<CreateGaugeOptions, 'className' | 'current'> {
  className?: string;
  style?: React.CSSProperties;
  data: { current: number; label?: string };
  config?: Omit<CreateGaugeOptions, 'current' | 'label' | 'className'>;
}

export function Wgauge(props: WgaugeProps) {
  const { className, style, data, config } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ReturnType<typeof createGaugeElement> | null>(null);

  const opts: CreateGaugeOptions = {
    ...config,
    current: data.current,
    label: data.label,
    className: '',
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const handle = createGaugeElement(opts);
    containerRef.current.appendChild(handle.el);
    handleRef.current = handle;
    return () => {
      handle.destroy();
      if (containerRef.current?.contains(handle.el)) {
        containerRef.current.removeChild(handle.el);
      }
      handleRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    handleRef.current?.update(opts);
  });

  return <div ref={containerRef} className={className} style={style} />;
}
