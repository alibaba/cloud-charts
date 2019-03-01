'use strict';

const locale = {
  'zh-cn': {
    reset: '重置',
  },
  'en-us': {
    reset: 'Reset',
  },
};

export default class ResetButton {
  constructor(chart, language) {
    this.chart = chart;
    this.isShow = false;
    this.dom = null;
    this.language = language;

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.hide();
  }

  show(language) {
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
        this.dom.innerText = (locale[this.language] || locale['zh-cn']).reset;
        this.dom.className = 'widgets-reset-button';
        this.dom.style.top = `${range.tr.y}px`;
        this.dom.style.right = `${chart.get('width') - range.tr.x}px`;
        wrapper.appendChild(this.dom);

        this.isShow = true;

        this.dom.addEventListener('click', this.handleClick);
      }
    }

    if (language !== this.language) {
      this.dom.innerText = (locale[language] || locale['zh-cn']).reset;

      this.language = language;
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
