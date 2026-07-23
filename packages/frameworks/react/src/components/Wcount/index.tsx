import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { createCountElement } from '@alicloud/cloud-charts-core';
import type { CreateCountOptions } from '@alicloud/cloud-charts-core';

export interface WcountProps extends Omit<CreateCountOptions, 'className' | 'end'> {
  className?: string;
  style?: React.CSSProperties;
  end?: number;
}

export function Wcount(props: WcountProps) {
  const { className, style, end = 0, ...rest } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ReturnType<typeof createCountElement> | null>(null);
  const prevEndRef = useRef(end);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const handle = createCountElement({ ...rest, end, className: '' });
    containerRef.current.appendChild(handle.el);
    handle.start();
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

  useEffect(() => {
    if (prevEndRef.current !== end && handleRef.current) {
      handleRef.current.update(end);
      prevEndRef.current = end;
    }
  }, [end]);

  return <div ref={containerRef} className={className} style={style} />;
}
