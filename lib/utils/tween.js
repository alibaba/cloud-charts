"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (name, duration, callback) {
  if (nameMap[name]) {
    //restart
    nameMap[name].start();
  } else {
    //start
    nameMap[name] = new Tween(duration, callback);
  }
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nameMap = {};

var Tween = function () {
  function Tween(duration, callback) {
    _classCallCheck(this, Tween);

    this._duration = duration;
    this._callback = callback;
    this.refresh = this.refresh.bind(this);

    this.start();
  }

  _createClass(Tween, [{
    key: "start",
    value: function start() {
      this._isPlay = true;
      this._startTime = Date.now();
      this.refresh();
    }
  }, {
    key: "stop",
    value: function stop() {
      this._isPlay = false;
    }
  }, {
    key: "refresh",
    value: function refresh() {
      if (this._isPlay) {
        setTimeout(this.refresh, 1000 / 60);
        this.update();
      }
    }
  }, {
    key: "update",
    value: function update() {
      var time = Date.now();

      if (time < this._startTime) {
        return true;
      }

      var elapsed = (time - this._startTime) / this._duration;
      elapsed = elapsed > 1 ? 1 : elapsed;

      this._callback(elapsed);

      if (elapsed === 1) {
        this.stop();
      }
    }
  }]);

  return Tween;
}();

module.exports = exports["default"];