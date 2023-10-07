'use strict';

import { Chart, Event } from '@antv/g2/esm/core';

type Coordinate = 'x' | 'y' | 'xy';

interface ConnectConfig {
  type?: 'position' | 'data';
  coordinate?: Coordinate;
  // custom?(e: Event, target: Chart, source: Chart): void;
}

class G2ConnectFilter {
  charts: Chart[];

  config: ConnectConfig;

  isBrushing: boolean;

  startPoint: [number, number];

  endPoint: [number, number];

  mask: any;

  constructor(charts: Chart[] = [], config: ConnectConfig = {}) {
    this.charts = [];

    // 配置项，后续添加数据联动等配置项
    this.config = Object.assign(
      {
        type: 'position',
        coordinate: 'x',
      },
      config,
    );

    this.isBrushing = false;

    // 添加绑定
    this.add.apply(this, charts);
  }

  add(...charts: Chart[]) {
    charts.forEach((chart) => {
      if (!isValidChart(chart)) {
        return;
      }

      if (this.charts.indexOf(chart) === -1) {
        // 存储实例的引用
        this.charts.push(chart);

        // 绑定事件 新版G2底层事件系统没有去重，需要手动去重
        chart.on('plot:mouseenter', this.handleMouseEnter);
        chart.on('plot:mousedown', this.handleMouseDown);
        chart.on('plot:mousemove', this.handleMouseMove);
        chart.on('plot:mouseup', this.handleMouseUp);
      }
    });
  }

  remove(...charts: Chart[]) {
    if (charts.length === 0) {
      // 清空所有绑定
      this.charts.forEach((chart) => {
        if (!isValidChart(chart)) {
          return;
        }

        chart.off('plot:mouseenter', this.handleMouseEnter);
        chart.off('plot:mousedown', this.handleMouseDown);
        chart.off('plot:mousemove', this.handleMouseMove);
        chart.off('plot:mouseup', this.handleMouseUp);
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
          chart.off('plot:mouseenter', this.handleMouseEnter);
          chart.off('plot:mousedown', this.handleMouseDown);
          chart.off('plot:mousemove', this.handleMouseMove);
          chart.off('plot:mouseup', this.handleMouseUp);
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

  handleMouseEnter = () => {
    this.charts.forEach((chart) => {
      chart.getCanvas().setCursor('crosshair');
    });
  };

  handleMouseDown = (() => {
    const self = this;
    return function (e: Event) {
      self.isBrushing = true;
      self.startPoint = [e.x, e.y];
    };
  })();

  handleMouseMove = (() => {
    const self = this;
    return function (e: Event) {
      if (!self.isBrushing) {
        return;
      }
      // @ts-ignore
      const chartInstance = this;
      const x = Math.min(self.startPoint[0], e.x);
      const y = Math.min(self.startPoint[1], e.y);
      const width = Math.abs(e.x - self.startPoint[0]);
      const height = Math.abs(e.y - self.startPoint[1]);

      // 显示mask
      if (!self.mask) {
        self.mask = chartInstance.foregroundGroup.addShape({
          type: 'rect',
          name: 'mask',
          draggable: true,
          attrs: {
            fill: '#C5D4EB',
            opacity: 0.3,
            x,
            y,
            width,
            height,
          },
        });
      } else {
        self.mask.attr({
          x,
          y,
          width,
          height,
        });
      }
    };
  })();

  handleMouseUp = (() => {
    const self = this;
    return function (e: Event) {
      if (!self.isBrushing) {
        return;
      }
      // @ts-ignore
      const chartInstance = this;
      const x = Math.min(self.startPoint[0], e.x);
      const y = Math.min(self.startPoint[1], e.y);
      const width = Math.abs(e.x - self.startPoint[0]);
      const height = Math.abs(e.y - self.startPoint[1]);

      const coord = chartInstance.getCoordinate();
      const normalStart = coord.invert({ x, y });
      const normalEnd = coord.invert({ x: x + width, y: y + height });

      // 过滤数据
      self.charts.forEach((chart) => {
        const xScale = chart.getXScale();
        const minValue = xScale.invert(normalStart.x);
        const maxValue = xScale.invert(normalEnd.x);

        let filterFunc = null;

        if (xScale.isCategory) {
          const minIndex = xScale.values.indexOf(minValue);
          const maxIndex = xScale.values.indexOf(maxValue);
          const arr = xScale.values.slice(minIndex, maxIndex + 1);
          filterFunc = (value: any) => {
            return arr.includes(value);
          };
        } else {
          filterFunc = (value: any) => {
            return value >= minValue && value <= maxValue;
          };
        }

        chart.filter(xScale.field, filterFunc);

        chart.render(true);
      });

      if (self.mask) {
        self.mask.hide();
      }

      self.isBrushing = false;
    };
  })();
}

/**
 * 判断图表是否有效
 *
 * @param {object} chart G2图表实例
 *
 * @return {boolean} 是否有效图例
 * */
function isValidChart(chart: Chart) {
  return chart && !chart.destroyed && chart.constructor === Chart;
}

export default G2ConnectFilter;
