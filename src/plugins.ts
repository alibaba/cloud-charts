import { ComponentType } from 'react';
import { warn } from './common/log';

interface PluginsMap {
  [name: string]: ComponentType
}

const plugins: PluginsMap = {};
const pluginManager = {
  register(name: string, p: ComponentType) {
    if (plugins[name]) {
      warn('plugin', `${name} has already registered.`);
      return;
    }
    plugins[name] = p;
  },
  get(name: string) {
    if (!name) {
      return plugins;
    }
    if (!plugins[name]) {
      warn('plugin', `${name} not find!`);
    }
    return plugins[name];
  },
};

export { plugins, pluginManager };
