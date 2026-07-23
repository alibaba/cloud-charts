import React, { useEffect, useRef } from 'react';

/**
 * 挂载 vanilla 渲染函数到 DOM 容器。
 * render(container) 在挂载及 deps 变化时执行；返回的 cleanup 函数会在卸载前调用。
 */
export function VanillaMount({ render, height = 300, deps = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return undefined;
    const cleanup = render(ref.current);
    return () => {
      if (typeof cleanup === 'function') cleanup();
      if (ref.current) ref.current.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return <div ref={ref} style={{ width: '100%', height }} />;
}
