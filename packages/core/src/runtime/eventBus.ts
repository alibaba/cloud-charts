type Listener = (...args: unknown[]) => void;

const listeners: Record<string, Set<Listener>> = {};

export function on(event: string, fn: Listener): () => void {
  if (!listeners[event]) listeners[event] = new Set();
  listeners[event].add(fn);
  return () => { listeners[event]?.delete(fn); };
}

export function off(event: string, fn: Listener): void {
  listeners[event]?.delete(fn);
}

export function emit(event: string, ...args: unknown[]): void {
  listeners[event]?.forEach((fn) => fn(...args));
}
