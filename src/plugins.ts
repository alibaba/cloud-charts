import { ReactElement } from 'react';

interface PluginsMap {
  [name: string]: ReactElement
}

const plugins: PluginsMap = {};
const pluginManager = {
  register(name: string, p: ReactElement) {
    if (plugins[name]) {
      console.warn(`plugin: ${name} has already registered.`);
      return;
    }
    plugins[name] = p;
  },
  get(name: string) {
    if (!name) {
      return plugins;
    }
    if (!plugins[name]) {
      console.warn(`plugin: ${name} not find!`);
    }
    return plugins[name];
  },
};

export { plugins, pluginManager };
