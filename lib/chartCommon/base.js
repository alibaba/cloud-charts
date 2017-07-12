'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _merge = require('../utils/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Base = function () {
  function Base(selector, options) {
    _classCallCheck(this, Base);

    this.element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.options = options || {};
    this.data = [];
    this.event = {};
  }

  _createClass(Base, [{
    key: 'destroy',
    value: function destroy() {
      this.element.innerHTML = '';
    }
  }, {
    key: 'getData',
    value: function getData(index) {
      if (typeof index === 'undefined' || index === '') return this.data;
      if (typeof index === 'number') return this.data[index] || null;
      var ret = null;
      this.data.forEach(function (item) {
        if (index === item.name) ret = item.data;
      });
      return ret;
    }
  }, {
    key: 'setData',
    value: function setData(data, sync) {
      var _this = this;

      //通用全量传入数据方法
      sync = sync === undefined ? true : sync;
      this.data = [];
      if (data && !Array.isArray(data) && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
        data = [data];
      }
      data.forEach(function (d, i) {
        if (!d) {
          _this.data.push({
            name: 'data' + i,
            data: []
          });
        } else if (Array.isArray(d)) {
          _this.data.push({
            name: 'data' + i,
            data: d
          });
        } else {
          _this.data.push({
            name: d.name || 'data' + i,
            data: d.data
          });
        }
      });
      if (sync) this.render();
    }
  }, {
    key: 'addData',
    value: function addData(data, index, shift, sync) {
      this.concatData([data], index, shift, sync);
    }
  }, {
    key: 'concatData',
    value: function concatData(data, index, shift, sync) {
      sync = sync === undefined ? true : sync;

      this.data.forEach(function (item) {
        if (index === item.name) {
          var d = item.data;
          d = d.concat(data);
          if (shift) d.splice(0, data.length);
          item.data = d;
        }
      });
      if (sync) this.render();
    }
  }, {
    key: 'updateData',
    value: function updateData(data, index, sync) {
      sync = sync === undefined ? true : sync;
      this.data.forEach(function (item) {
        if (index === item.name) {
          item.data = data;
        }
      });
      if (sync) this.render();
    }
  }, {
    key: 'getOption',
    value: function getOption(key) {
      if (key) return this.options[key];else return this.options;
    }
  }, {
    key: 'setOption',
    value: function setOption(options, sync) {
      sync = sync === undefined ? true : sync;
      (0, _merge2.default)(this.options, options);
      if (sync) this.render();
    }
  }, {
    key: 'on',
    value: function on(event, callback) {
      if (!this.event[event]) this.event[event] = [];
      this.event[event].push(callback);
    }
  }, {
    key: 'fire',
    value: function fire(event) {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (this.event[event]) {
        this.event[event].forEach(function (callback) {
          callback.call.apply(callback, [_this2].concat(args));
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {}
  }]);

  return Base;
}();

exports.default = Base;
module.exports = exports['default'];