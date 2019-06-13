"use strict";

exports.__esModule = true;
var plugins = {};
var pluginManager = {
  register: function register(name, p) {
    if (plugins[name]) {
      console.warn("plugin: " + name + " has already registered.");
      return;
    }
    plugins[name] = p;
  },
  get: function get(name) {
    if (!name) {
      return plugins;
    }
    if (!plugins[name]) {
      console.warn("plugin: " + name + " not find!");
    }
    return plugins[name];
  }
};

exports.plugins = plugins;
exports.pluginManager = pluginManager;