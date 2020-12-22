'use strict';

import g2Factory from '../common/g2Factory';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap, defaultPadding, merge } from '../common/common';
import guide from '../common/guide';
import rectXAxis from '../common/rectXAxis';
import rectYAxis from '../common/rectYAxis';
import rectAutoTickCount from '../common/rectAutoTickCount';
import rectTooltip from '../common/rectTooltip';
import rectLegend from '../common/rectLegend';
import legendFilter from '../common/legendFilter';
import getGeomSizeConfig from '../common/geomSize';
import './G2Candlestick.scss';

// function parseCandlestickItem(oneData) {
//   const { name: dataName, visible, ...groupExtra } = oneData;
//
//   return oneData.data.map(([date, { start, end, max, min, ...extra }]) => ({
//     x: date,
//     y: [start, end, max, min],
//     start,
//     end,
//     max,
//     min,
//     trend: start <= end ? 'up' : 'down',
//     extra,
//     groupExtra,
//     visible,
//     type: dataName,
//   }));
// }
//
// function computeData(data) {
//   if (!data) {
//     return [];
//   }
//   if (!Array.isArray(data)) {
//     data = [data];
//   }
//   const newData = [];
//
//   data.forEach(oneData => {
//     if (!oneData || !Array.isArray(oneData.data)) {
//       return;
//     }
//
//     const { name: dataName, visible, ...groupExtra } = oneData;
//
//     oneData.data.forEach(([date, { start, end, max, min, ...extra }]) => {
//       newData.push({
//         x: date,
//         y: [start, end, max, min],
//         start,
//         end,
//         max,
//         min,
//         trend: start <= end ? 'up' : 'down',
//         extra,
//         groupExtra,
//         visible,
//         type: dataName,
//       });
//     });
//   });
//
//   return newData;
// }

function computeDataType(data) {
  if (Array.isArray(data)) {
    data.forEach((d) => {
      if (Array.isArray(d.y)) {
        const [start, end, max, min] = d.y;
        d.trend = start <= end ? 'up' : 'down';
      }
    })
  }
  return data;
}

export default /*#__PURE__*/ errorWrap(g2Factory('G2Candlestick', {
  // convertData: false,
  getDefaultConfig() {
    return {
      colors: [themes.widgetsColorRed, themes.widgetsColorGreen],
      padding: ['auto', 'auto', 'auto', 'auto'],
      xAxis: {
        type: 'time',
        mask: 'YYYY-MM-DD',
        labelFormatter: null, // 可以强制覆盖，手动设置label
        categories: null,
        autoRotate: false,
      },
      yAxis: {
        labelFormatter: null, // 可以强制覆盖，手动设置label
        max: null,
        min: null,
      },
      legend: {
        // align: 'left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
      tooltip: {
        showTitle: true,
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      grid: false,
      // zoom: false,
      size: null,
      // label: false,
    };
  },
  beforeInit(props) {
    const { config } = props;
    const newConfig = merge({}, this.defaultConfig, config);

    // TODO 处理padding
    return Object.assign({}, props, {
      padding: defaultPadding(
        props.padding || config.padding,
        newConfig,
        ...this.defaultConfig.padding
      ),
      config: newConfig,
    });
  },
  init(chart, userConfig, data) {
    const config = userConfig;

    // 设置数据度量
    const defs = {
      x: propertyAssign(
        propertyMap.xAxis,
        {
          type: 'time',
        },
        config.xAxis
      ),
      y: propertyAssign(
        propertyMap.yAxis,
        {
          type: 'linear',
          tickCount: 5,
        },
        config.yAxis
      ),
      type: {
        type: 'cat',
      },
      trend: {
        type: 'cat',
      }
    };

    rectAutoTickCount(chart, config, defs, false);

    chart.source(computeDataType(data), defs);

    // 设置单个Y轴
    rectYAxis.call(this, chart, config);

    // 设置X轴
    rectXAxis.call(this, chart, config);

    chart.legend('x', false);
    chart.legend('y', false);
    // 设置图例
    rectLegend.call(this, chart, config, {
      // useHtml: false,
    }, true, 'trend');

    legendFilter.call(this, chart, config);

    // tooltip
    const { showTitle, showColon } = config.tooltip || {};
    rectTooltip.call(
      this,
      chart,
      config,
      {
        showTitle: true,
        crosshairs: {
          type: 'rect',
        },
        itemTpl: `<div>
            ${
          showTitle
            ? '<div style="margin:10px 0;"><span style="background-color:{color};width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:8px;"></span>{group}</div>'
            : ''
        }
            <div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelStart}</span>${
          showColon ? ':' : ''
        }<span class="g2-tooltip-item-value">{start}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelEnd}</span>${
          showColon ? ':' : ''
        }<span class="g2-tooltip-item-value">{end}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMax}</span>${
          showColon ? ':' : ''
        }<span class="g2-tooltip-item-value">{max}</span></div><div style="margin:8px 0 0;"><span class="g2-tooltip-item-name">{labelMin}</span>${
          showColon ? ':' : ''
        }<span class="g2-tooltip-item-value">{min}</span></div>
          </div>`
      }
    );

    // 绘制辅助线，辅助背景区域
    guide(chart, config);

    drawCandle(chart, config, config.colors);

    chart.render();
  },
  changeData(chart, data) {
    chart.changeData(computeDataType(data));
  }
}));

function drawCandle(chart, config, colors) {
  const { size } = config;
  let geom = null;

  // 分组
  geom = chart
    .schema()
    .position(['x', 'y'])
    .shape('candle')
    .color('trend', trend => {
      const [colorUp, colorDown] = colors;
      return trend === 'up' ? colorUp : colorDown;
    })
    // .tooltip('type*start*end*max*min', (group, start, end, max, min) => {
    .tooltip('y*type', (y, group) => {
      const { labelAlias = {} } = config.tooltip || {};
      const {
        start: labelStart,
        end: labelEnd,
        max: labelMax,
        min: labelMin,
      } = labelAlias;

      const [start, end, max, min] = y;

      return {
        group,
        start,
        end,
        max,
        min,
        labelStart: labelStart || 'start',
        labelEnd: labelEnd || 'end',
        labelMax: labelMax || 'max',
        labelMin: labelMin || 'min',
      };
    });

  if (size) {
    const sizeConfig = getGeomSizeConfig(size, 20, 'y', 'x*y*type*extra');
    geom.size(...sizeConfig);
  }
}
