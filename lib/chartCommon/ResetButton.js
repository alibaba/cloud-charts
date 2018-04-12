'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResetButton = function () {
  function ResetButton(chart) {
    _classCallCheck(this, ResetButton);

    this.chart = chart;
    this.isShow = false;
    this.dom = null;

    this.handleClick = this.handleClick.bind(this);
  }

  _createClass(ResetButton, [{
    key: 'handleClick',
    value: function handleClick(e) {
      e.preventDefault();
      this.hide();
    }
  }, {
    key: 'show',
    value: function show() {
      if (this.isShow) {
        return;
      }

      if (this.dom) {
        this.dom.style.display = 'block';
        this.isShow = true;
      } else {
        var chart = this.chart;
        var wrapper = chart.get('wrapperEl');
        var range = chart.get('plotRange');
        if (wrapper && range && range.tr) {
          this.dom = document.createElement('span');
          this.dom.innerText = '重置';
          this.dom.className = 'widgets-reset-button';
          this.dom.style.top = range.tr.y + 'px';
          this.dom.style.right = chart.get('width') - range.tr.x + 'px';
          wrapper.appendChild(this.dom);

          this.isShow = true;

          this.dom.addEventListener('click', this.handleClick);
        }
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.isShow && this.dom) {
        this.chart.get('options').filters = {};
        this.chart.repaint();
        this.dom.style.display = 'none';
        this.isShow = false;
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.dom) {
        this.dom.removeEventListener('click', this.handleClick);
        this.dom.parentNode.removeChild(this.dom);
        this.dom = null;
      }
      this.chart = null;
    }
  }]);

  return ResetButton;
}();

exports.default = ResetButton;
module.exports = exports['default'];