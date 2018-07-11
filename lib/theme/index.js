'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _normal = require('./normal');

Object.keys(_normal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _normal[key];
    }
  });
});