const plugins = {};
const pluginManager = {
  register(name, p) {
    if (plugins[name]) {
      console.warn(`plugin: ${name} has already registered.`);
      return;
    }
    plugins[name] = p;
  },
  get(name) {
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
