import f2Factory from '../common/f2Factory';
import { color } from '../theme/';
import { getPoint, generateUniqueId, setDomStyle } from '../common/f2Utils';

const colorMap = color.category_12;
const clientWidth = window.innerWidth;
const defaultLegendFormatter = d =>
  `<span class="name" style="color: ${color.widgetsTooltipTitle}; margin-right: 6px;">
    ${d.name}
  </span>
  <span class="value" style="color: ${color.widgetsTooltipText}">
    ${d.value ? d.value : ''}
  </span>`;

const defaultConfig = {
  width: clientWidth,
  height: 160,
  padding: [10, 10, 10, 10],
  xAxis: {},
  yAxis: {
    min: 0
  },
  tooltip: true,
  legend: { show: true, dir: 'top' },
  colors: colorMap,

  autoSort: false,
};

const barConfig = {
  tooltipId: generateUniqueId('bar'),

  beforeInit(props) {
    const newProps = { ...props };
    const newConfig = Object.assign({}, defaultConfig, props.config);

    if (typeof newConfig.legend === 'undefined' || typeof newConfig.legend === 'boolean') {
      newConfig.legend = {};
    }

    if (newConfig.legend) {
      const { dir = 'top', show = true, formatter = defaultLegendFormatter } = newConfig.legend;

      newConfig.legend.dir = dir;
      newConfig.legend.show = show;
      newConfig.legend.formatter = formatter;
    }

    newProps.config = newConfig;
    return newProps;
  },

  init(chart, userConfig, data) {
    const { type, showTop } = userConfig;

    if (userConfig.autoSort) {
      data.sort((a, b) => b.y - a.y);
    }
    chart.source(data, {
      y: {
        tickCount: 5
      }
    });

    chart.axis('x', {
      label: {
        fontSize: 10
      },
      // x轴文字和轴间距5px
      labelOffset: 5,
      grid: null
    });

    chart.axis('y', {
      label: {
        fontSize: 10
      }
    });

    if (type === 'cascade') {
      chart
        .interval()
        .position('x*y')
        .color('type')
        .adjust('stack');
    } else if (type === 'dodge') {
      chart
        .interval()
        .position('x*y')
        .color('type')
        .adjust('dodge');
    } else {
      chart
        .interval()
        .position('x*y')
        .color('type');
    }

    if (showTop && type !== 'cascade' && type !== 'dodge') {
      data.forEach((obj) => {
        const offsetY = -20;
        chart
          .guide()
          .html(
            [obj.x, obj.y],
            `<div style='color: ${color.widgetsColorBlue};font-size: 10px'><span>${obj.y}</span></div>`,
          {
            align: 'bc',
            offset: [0, offsetY]
          }
          );
      });
    }

    chart.render();
  },

  chartTouchStart(e, chart, config, canvas, resultData, originData, elem, self) {
    self.inMove = true;
    self.currentCanvasData = null;

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const point = getPoint(canvas, x, y);
    // 根据画布坐标获取对应数据集
    const data = chart.getSnapRecords(point);
    self.currentCanvasData = data;
    // 画辅助线
    self.drawGuideLine(data, elem, canvas, config);

    self.drawTopContent(data, canvas, config, self);
  },

  chartTouchMove(e, chart, config, canvas, resultData, originData, elem, self) {
    // 只有在移动的时候才计算
    if (self.inMove) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;

      const point = getPoint(canvas, x, y);
      // 根据画布坐标获取对应数据集
      const data = chart.getSnapRecords(point);
      if (data && self.currentCanvasData) {
        if (data[0].x === self.currentCanvasData[0].x && data[0].y === self.currentCanvasData[0].y) {
          // 如果还在原来的数据上则什么都不做
          return;
        }
          // 如果发现当前的点和之前的不一样，则重新画辅助线和tooltip
        self.removeGuideLine(elem);
        self.currentCanvasData = data;
        self.drawGuideLine(data, elem, canvas, config);
        self.drawTopContent(data, canvas, config, self);
      }
    }
  },

  chartTouchEnd(e, chart, config, canvas, resultData, originData, elem, self) {
    self.inMove = false;
    self.removeGuideLine(elem);
    self.removeTopContent(self, elem);
  },

  drawTopContent(data, canvas, config, self) {
    if (!config.tooltip) {
      return;
    }
    const dataArr = [];
    const x = data[0]._origin.x;
    data.forEach((i) => {
      dataArr.push({
        color: i.color,
        name: i._origin.type,
        value: i._origin.y
      });
    });

    let topContentStr =
      `<div class="top-content" style="display: flex; flex-wrap: wrap; WebkitUserSelect: none;flex-direction: column; width: ${
      clientWidth
      }px; padding: 8px 12px; font-size: 12px; line-height: 1.2 ">`;

    topContentStr += `<div style="color: #000">${x}</div>`;
    topContentStr += '<div style="display: flex; flex-direction: row;flex-wrap: wrap;">';

    dataArr.forEach((i) => {
      let dotColor = i.color;
      if (colorMap.indexOf(dotColor) >= 0) {
        dotColor = colorMap[colorMap.indexOf(dotColor)];
      }
      topContentStr += `<div style="margin-right: 30px; margin-top: 12px; white-space: nowrap"><span style="display: inline-block; box-sizing: border-box;margin-right: 4px;text-align: center;width: 14px;height: 14px;border-radius: 100%;background-color: #fff;border: 1px solid ${dotColor}"><span style="display: inline-block; width: 10px;height: 10px; border-radius: 100%;background-color:${dotColor}"></span></span><span class="name" style="color: ${
        color.widgetsTooltipTitle
      }; margin-right: 6px;">${i.name}</span><span class="value" style="color: ${color.widgetsTooltipText}">${
        i.value !== null ? i.value : ''
      }</span></div>`;
    });
    topContentStr += '</div></div>';

    let topContentDiv = document.querySelector(`#${self.tooltipId}`);
    if (!topContentDiv) {
      topContentDiv = document.createElement('div');
      topContentDiv.id = self.tooltipId;
      setDomStyle(topContentDiv, {
        backgroundColor: color.widgetsTooltipBackground,
        position: 'absolute',
        top: -100,
        left: 0,
        borderStyle: 'solid',
        borderColor: color.widgetsTooltipCrossLine,
        borderWidth: '1px 0 1px',
        padding: 8,
        boxSizing: 'border-box',
        width: `${clientWidth}px`,
        overflow: 'hidden'
      });
      document.body.appendChild(topContentDiv);
    }

    topContentDiv.innerHTML = topContentStr;

    setDomStyle(topContentDiv, {
      top: `${canvas.getClientRects()[0].top + window.scrollY - topContentDiv.getClientRects()[0].height + config.padding[0]}px`
    });
  },

  removeTopContent(self, elem) {
    const parentContainer = document.querySelector(`#aismcontainer-${elem.chartId}`);
    // 如果有辅助线，则清除
    const tipLines = parentContainer.querySelector('.tipLine');
    if (tipLines) {
      for (let j = 0; j < tipLines.length; j++) {
        if (tipLines[j]) parentContainer.removeChild(tipLines[j]);
      }
    }
    const tooltip = document.querySelector(`#${self.tooltipId}`);
    if (tooltip) {
      document.body.removeChild(tooltip);
    }
  },

  drawGuideLine(data, elem, canvas, config) {
    const { tooltipType, type } = config;
    const container = document.querySelector(`#aismcontainer-${elem.chartId}`);
    // 构造图例的数据
    const legendData = data.concat([]);
    legendData.map((d) => {
      d.name = d._origin.type;
      d.value = d._origin.y;
    });

    const resultArr = [];
    data.forEach((i) => {
      resultArr.push({
        color: i.color,
        name: i._origin.type,
        value: i._origin.y
      });
    });
    elem.renderLegend(config.legend.dir, resultArr);

    if (tooltipType === 'simple') {
      // 简单模式的辅助线
      const { x: tipLineX, y: tipLineY } = data[0];

      // x轴方向的tipline
      const xTipLine = document.createElement('div');
      xTipLine.className = 'tipLine';
      xTipLine.style.borderColor = '#ccc';
      xTipLine.style.borderWidth = '1px 0 0';
      xTipLine.style.borderStyle = 'dashed';
      xTipLine.style.position = 'absolute';
      xTipLine.style.left = `${config.padding[3]}px`;
      xTipLine.style.top = `${tipLineY}px`;
      xTipLine.style.height = 0;
      xTipLine.style.width = `${canvas.getClientRects()[0].width -
        config.padding[1] -
        config.padding[3]}px`;
      container.appendChild(xTipLine);

      // y轴方向的tipline
      const tipLine = document.createElement('div');
      tipLine.className = 'tipLine';
      tipLine.style.borderColor = '#ccc';
      tipLine.style.width = 0;
      tipLine.style.borderWidth = '0 1px 0 0 ';
      tipLine.style.borderStyle = 'dashed';
      tipLine.style.position = 'absolute';
      tipLine.style.left = `${tipLineX - 0.5}px`;
      tipLine.style.top = `${10}px`;
      tipLine.style.height = `${tipLineY + config.padding[0] + 10}px`;
      container.appendChild(tipLine);
    } else if (type === 'cascade') {
      // 如果是复杂的tooltip， 只需要画y轴方向的tipline
      const { x: tipLineX } = data[0];
      const lastData = data[data.length - 1];
      const tipLineY = lastData.y[lastData.y.length - 1];
      const tipLine = document.createElement('div');
      tipLine.className = 'tipLine';
      tipLine.style.borderColor = '#ccc';
      tipLine.style.width = 0;
      tipLine.style.borderWidth = '0 1px 0 0 ';
      tipLine.style.borderStyle = 'dashed';
      tipLine.style.position = 'absolute';
      tipLine.style.left = `${tipLineX - 0.5}px`;
      tipLine.style.top = `${10}px`;
      tipLine.style.height = `${tipLineY + config.padding[0]}px`;
      container.appendChild(tipLine);
    } else if (type === 'dodge') {
      // 如果两个柱的图，寻找中间的y坐标， 只需要画y轴方向的tipline
      const { x: tipLineX1 } = data[0];
      const { x: tipLineX2 } = data[1];
      const lastData = data[data.length - 1];
      const tipLineY = lastData.y;
      const tipLine = document.createElement('div');
      tipLine.className = 'tipLine';
      tipLine.style.borderColor = '#ccc';
      tipLine.style.width = 0;
      tipLine.style.borderWidth = '0 1px 0 0 ';
      tipLine.style.borderStyle = 'dashed';
      tipLine.style.position = 'absolute';
      tipLine.style.left = `${(tipLineX1 - 0.5) / 2 + (tipLineX2 - 0.5) / 2}px`;
      tipLine.style.top = `${10}px`;
      tipLine.style.height = `${tipLineY + config.padding[0]}px`;
      container.appendChild(tipLine);
    }
  },

  // 清除辅助线
  removeGuideLine(elem) {
    const container = document.querySelector(`#aismcontainer-${elem.chartId}`);
    const tipLines = container.querySelectorAll('.tipLine');
    tipLines.forEach((t) => {
      container.removeChild(t);
    });

    const topContain = container.querySelector('.topContain');
    if (topContain) {
      container.removeChild(topContain);
    }
  }
};

export default f2Factory('f2Bar', barConfig);
