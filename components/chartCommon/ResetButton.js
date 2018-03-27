'use strict';

export default class ResetButton {
  constructor(chart) {
    this.chart = chart;
    this.isShow = false;
    this.dom = null;

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.hide();
  }

  show() {
    if (this.isShow) {
      return;
    }

    if (this.dom) {
      this.dom.style.display = 'block';
      this.isShow = true;
    } else {
      const chart = this.chart;
      const wrapper = chart.get('wrapperEl');
      const range = chart.get('plotRange');
      if (wrapper && range && range.tr) {
        this.dom = document.createElement('span');
        this.dom.innerText = '重置';
        this.dom.className = 'widgets-reset-button';
        this.dom.style.top = range.tr.y + 'px';
        this.dom.style.right = (chart.get('width') - range.tr.x) + 'px';
        wrapper.appendChild(this.dom);

        this.isShow = true;

        this.dom.addEventListener('click', this.handleClick);
      }
    }
  }

  hide() {
    if (this.isShow && this.dom) {
      this.chart.get('options').filters = {};
      this.chart.repaint();
      this.dom.style.display = 'none';
      this.isShow = false;
    }
  }

  destroy() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
      this.dom.parentNode.removeChild(this.dom);
      this.dom = null;
    }
    this.chart = null;
  }
}