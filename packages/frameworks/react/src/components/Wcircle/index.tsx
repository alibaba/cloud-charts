import React, { useRef, useLayoutEffect } from 'react';
import { createCircleElement } from '@alicloud/cloud-charts-core';
import type { CreateCircleOptions } from '@alicloud/cloud-charts-core';

export interface WcircleProps extends Omit<CreateCircleOptions, 'className'> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Wcircle(props: WcircleProps) {
  const { className, style, children, ...rest } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ReturnType<typeof createCircleElement> | null>(null);

  const value = children != null ? String(children) : rest.value;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const handle = createCircleElement({ ...rest, value, className: '' });
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
    handleRef.current?.update({ ...rest, value });
  });

  return <div ref={containerRef} className={className} style={style} />;
}
