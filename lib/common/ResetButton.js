'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResetButton = function () {
  function ResetButton(chart) {
    _classCallCheck(this, ResetButton);

    this.chart = chart;
    this.isShow = false;
    this.dom = null;

    this.handleClick = this.handleClick.bind(this);
  }

  ResetButton.prototype.handleClick = function handleClick(e) {
    e.preventDefault();
    this.hide();
  };

  ResetButton.prototype.show = function show() {
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
  };

  ResetButton.prototype.hide = function hide() {
    if (this.isShow && this.dom) {
      this.chart.get('options').filters = {};
      this.chart.repaint();
      this.dom.style.display = 'none';
      this.isShow = false;
    }
  };

  ResetButton.prototype.destroy = function destroy() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
      this.dom.parentNode.removeChild(this.dom);
      this.dom = null;
    }
    this.chart = null;
  };

  return ResetButton;
}();

exports.default = ResetButton;
module.exports = exports['default'];