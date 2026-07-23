import React, { useRef, useLayoutEffect } from 'react';
import { createNumberElement } from '@alicloud/cloud-charts-core';
import type { CreateNumberOptions } from '@alicloud/cloud-charts-core';

export interface WnumberProps extends Omit<CreateNumberOptions, 'className'> {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Wnumber(props: WnumberProps) {
  const { className, style, children, ...rest } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<ReturnType<typeof createNumberElement> | null>(null);

  const value = children != null ? String(children) : rest.value != null ? String(rest.value) : undefined;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const handle = createNumberElement({ ...rest, value, className: '' });
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
