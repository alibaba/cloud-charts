'use strict';
import G2 from '@antv/g2';

export default class Connect1 {
  charts = [];

  // 配置项，后续添加数据联动等配置项
  config = {};

  constructor(charts = [], config = {}) {
    // 配置项
    Object.assign(this.config, config);

    // 添加绑定
    this.add.apply(this, charts);
  }

  add(...charts) {
    charts.forEach((chart) => {
      if (!isValidChart(chart)) {
        return;
      }

      if (this.charts.indexOf(chart) === -1) {
        // 存储实例的引用
        this.charts.push(chart);

        // 绑定事件
        // G2 底层的事件系统 wolfy87-eventemitter 中已经有有去重逻辑，所以直接绑定事件即可。
        chart.on('plotmove', this.handlePlotmove);
        chart.on('plotleave', this.handlePlotleave);
      }
    });
  }

  remove(...charts) {
    if (charts.length === 0) {
      // 清空所有绑定
      this.charts.forEach((chart) => {
        if (!isValidChart(chart)) {
          return;
        }

        chart.off('plotmove', this.handlePlotmove);
        chart.off('plotleave', this.handlePlotleave);
      });

      this.charts = [];
    } else {
      charts.forEach((chart) => {
        if (!isValidChart(chart)) {
          return;
        }

        const index = this.charts.indexOf(chart);
        if (index !== -1) {
          // 去除实例的存储
          this.charts.splice(index, 1);

          // 绑定事件
          // G2 底层的事件系统 wolfy87-eventemitter 中已经有有去重逻辑，所以直接绑定事件即可。
          chart.off('plotmove', this.handlePlotmove);
          chart.off('plotleave', this.handlePlotleave);
        }
      });
    }

  }

  destroy() {
    this.remove();
  }

  // 事件相关函数
  // 需要注意的是，这里用闭包创建特殊的行为函数。
  // 事件函数被调用时，this（chartInstance）会指向触发事件的图表实例，而self指向connect类的实例

  handlePlotmove = (() => {
    const self = this;
    return function (e) {
      // 显式声明this，指向触发事件的图表实例
      const chartInstance = this;
      self.charts.forEach((chart) => {
        // 过滤自身和已销毁的实例
        if (chart !== chartInstance && !chart.destroyed) {
          // 显示tooltip
          chart.showTooltip(e);
        }
      });
    }
  })();

  handlePlotleave = (() => {
    const self = this;
    return function () {
      // 显式声明this，指向触发事件的图表实例
      const chartInstance = this;
      self.charts.forEach((chart) => {
        // 过滤自身和已销毁的实例
        if (chart !== chartInstance && !chart.destroyed) {
          // 隐藏tooltip
          chart.hideTooltip();
        }
      });
    }
  })();
}

/**
 * 判断图表是否有效
 * @param {Chart} chart G2图表实例
 * @return {boolean} 是否有效图例
 * */
function isValidChart(chart) {
  return chart && !chart.destroyed && chart.constructor === G2.Chart;
}
