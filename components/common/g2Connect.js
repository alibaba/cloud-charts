'use strict';

import G2 from '@antv/g2';

export default class G2Connect {
  constructor(charts = [], config = {}) {
    this.charts = [];

    // 配置项，后续添加数据联动等配置项
    this.config = Object.assign({
      type: 'position',
      coordinate: 'xy',
      custom: null,
    }, config);

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
      const { type, coordinate, custom } = self.config;
      // 显式声明this，指向触发事件的图表实例
      const chartInstance = this;
      const record = type === 'data' ? getRecord(chartInstance, e) : null;
      self.charts.forEach((chart) => {
        // 过滤自身和已销毁的实例
        if (chart === chartInstance || chart.destroyed) {
          return;
        }

        if (custom) {
          custom(e, chart, chartInstance);
          return;
        }

        if (type === 'data' && record) {
          // 根据数据找到对应点，如果传入的数据不在画布空间内，point 为 null
          const point = chart.getXY(record);
          // 如果数据中包含null, point中的坐标会变为 NaN，所以下面添加额外判断
          if (point && !isNaN(point.x) && !isNaN(point.y)) {
            // 找到对应的点，显示并return
            chart.showTooltip(getPoint(point, e, coordinate));
            return;
          }
        }

        // 兜底方案，根据e直接显示tooltip
        chart.showTooltip(e);
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
 *
 * @param {object} chart G2图表实例
 *
 * @return {boolean} 是否有效图例
 * */
function isValidChart(chart) {
  return chart && !chart.destroyed && chart.constructor === G2.Chart;
}

/**
 * 获取原始数据
 *
 * @param {object} chart G2图表实例
 * @param {object} e G2 plotmove 事件传入的参数
 *
 * @return {object|null} 获取的原始数据，没有找到时为 null
 * */
function getRecord(chart, e) {
  let record = e.data && e.data._origin;
  if (!record) {
    record = chart.getSnapRecords(e);
    if (Array.isArray(record) && record[0]) {
      record = record[0]._origin;
    } else {
      record = null;
    }
  }

  return record;
}

/**
 * 按照coordinate设置获取正确的坐标
 *
 * @param {object} point 原始获得的坐标
 * @param {object} e G2 plotmove 事件传入的参数
 * @param {string} coordinate 坐标设置
 *
 * @return {object} 正确的坐标
 * */
function getPoint(point, e, coordinate) {
  if (coordinate === 'x') {
    point.y = e.y;
  }
  if (coordinate === 'y') {
    point.x = e.x;
  }
  return point
}
