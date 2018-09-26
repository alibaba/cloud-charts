import f2Factory from '../common/f2Factory';
import { color } from '../theme/';
import { getPoint, generateUniqueId, setDomStyle } from '../common/f2Utils';

const clientWidth = window.innerWidth;
const colorMap = color.category_12;
const guideColorMap = ['#EF5350', '#F9A825'];

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
  padding: [10, 10, 20, 10],
  colors: colorMap,
  xAxis: {
    // type: 'timeCat',
    // mask: 'YYYY-MM-DD HH:mm:ss'
  },
  yAxis: {
    min: 0
  },
  tooltip: true,
  legend: true,
  area: false,
  // F2 不支持 stack
  stack: false,
  spline: false,
  grid: false,
  symbol: false,
  zoom: false,
};

const id = generateUniqueId('line');

const renderTopContent = (x, dataArr, canvas, config) => {
  let topContentStr =
    `<div class="top-content" style="display: flex; flex-wrap: wrap; WebkitUserSelect: none;flex-direction: column; width: ${
    clientWidth
    }px; padding: 8px 12px; font-size: 12px; line-height: 1.2 ">`;

  // if (dataArr.length >= 2) {
  topContentStr += `<div style="color: #000">${x}</div>`;
  // }
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

  let topContentDiv = document.querySelector(`#${id}`);
  if (!topContentDiv) {
    topContentDiv = document.createElement('div');
    topContentDiv.id = id;
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
};

const line = {
  beforeInit(props) {
    const newProps = Object.assign({}, props);
    const newConfig = Object.assign({}, defaultConfig, newProps.config);

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
  init(chart, userConfig, data, rawData) {
    const defs = {
      x: {
        type: userConfig.xAxis.type || 'cat',
        tickCount: 5,
        range: [0, 1]
      },
      y: {
        tickCount: 4,
        min: 0
      }
    };
    // 配置刻度文字大小，供PC端显示用(移动端可以使用默认值20px)
    if (userConfig.xAxis.show === false) {
      chart.axis('x', false);
    } else {
      chart.axis('x', {
        // 设置坐标轴线的样式，如果值为 null，则不显示坐标轴线，图形属性
        line: {
          lineWidth: 1,
          stroke: '#d8d8d8'
        },
        // 坐标轴文本距离轴线的距离
        labelOffset: 5,
        // 坐标点对应的线，null 不显示，图形属性
        tickLine: null,
        // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
        label: (text, index, total) => {
          const cfg = {
            fill: '#979797',
            offset: 6,
            fontSize: 10
          };
          if (index === 0) {
            cfg.textAlign = 'left';
          }
          if (index > 0 && index === total - 1) {
            cfg.textAlign = 'right';
          }
          cfg.text = text; // cfg.text 支持文本格式化处理
          return cfg;
        },
        grid: null
      });
    }

    if (userConfig.yAxis.show === false) {
      chart.axis('y', false);
    } else {
      chart.axis('y', {
        custom: true,
        label: {
          fontSize: 10
        },
        labelOffset: -1
      });
    }

    // 确保当 y 轴数值都为 undefined 或 null 的时候 max 不小于 min
    if (data.every(item => item.y == null)) {
      defs.y.max = 1;
    }

    chart.source(data, defs);

    const lineShape = userConfig.spline ? 'smooth' : 'line';
    const areaShape = userConfig.spline ? 'smooth' : 'area';

    if (userConfig.area) {
      chart.area().position('x*y').shape(areaShape).color('type', (value) => {
        let index;
        rawData.forEach((i, j) => {
          if (i.name === value) {
            index = j;
          }
        });
        return colorMap[index];
      });
    }

    chart
      .line()
      .position('x*y')
      .shape(lineShape)
      .color('type')
      .style({
        lineWidth: 1.5
      });

    if (userConfig.guides) {
      userConfig.guides.forEach((guide, index) => {
        if (Array.isArray(guide.value)) {
          guide.value.forEach((item) => {
            chart.guide().line([item, 0], [item, 30], {
              lineWidth: 1.5, // 辅助线宽度
              stroke: guide.color || guideColorMap[index] // 辅助线颜色设置
            });
          });
        } else {
          chart.guide().line([guide.value, 0], [guide.value, 30], {
            lineWidth: 1.5, // 辅助线宽度
            stroke: guide.color || guideColorMap[index] // 辅助线颜色设置
          });
        }
      });
    }

    chart.render();
  },
  // 画点
  renderPoint(config, data, resultArr, canvas, elem) {
    const parentContainer = document.querySelector(`#aismcontainer-${elem.chartId}`);
    const parentCanvas = parentContainer.querySelector('canvas');
    const legendContainer = document.querySelector(`#aismlegend${elem.chartId}`);
    const legendHeight = legendContainer.children.length ? legendContainer.getClientRects()[0].height : 0;
    const dirTop = config.legend.dir && config.legend.dir === 'top';

    // 画点
    if (parentContainer.querySelector('.tipPoint')) {
      const tipPoints = parentContainer.querySelectorAll('.tipPoint');
      const tipLine1 = parentContainer.querySelector('.tipLine');
      for (let i = 0; i < tipPoints.length; i++) {
        parentContainer.removeChild(tipPoints[i]);
      }
      if (tipLine1) {
        parentContainer.removeChild(tipLine1);
      }
    }

    if (config.tooltip !== false) {
      renderTopContent(data[0]._origin.x, resultArr, canvas, config);
    }

    const tipLineX = data[0].x;
    const tipLineY = data[0].y;
    // y轴方面的tip
    const tipLine = document.createElement('div');
    tipLine.className = 'tipLine';
    tipLine.style.borderColor = '#ccc';
    tipLine.style.width = 0;
    tipLine.style.borderWidth = '0 1px 0 0 ';
    tipLine.style.borderStyle = 'dashed';
    tipLine.style.position = 'absolute';
    tipLine.style.left = `${tipLineX - 0.5}px`;
    tipLine.style.top = `${16 + config.padding[0]}px`;
    tipLine.style.height = `${parentContainer.querySelector('canvas').getClientRects()[0].height -
      config.padding[0] -
      config.padding[2]}px`;
    // x轴方向的tipline
    const xTipLine = document.createElement('div');
    xTipLine.className = 'tipLine';
    xTipLine.style.borderColor = '#ccc';
    xTipLine.style.borderWidth = '1px 0 0';
    xTipLine.style.borderStyle = 'dashed';
    xTipLine.style.position = 'absolute';
    xTipLine.style.left = `${config.padding[3]}px`;
    xTipLine.style.top = dirTop ? `${tipLineY + legendHeight}px` : `${tipLineY}px`;
    xTipLine.style.height = 0;
    xTipLine.style.width = `${parentCanvas.getClientRects()[0].width - config.padding[1] - config.padding[3]}px`;

    parentContainer.appendChild(tipLine);
    parentContainer.appendChild(xTipLine);
    const dataArr = [];

    data.forEach((dataItem) => {
      let tipColor = dataItem.color;
      if (colorMap.indexOf(tipColor) >= 0) {
        tipColor = colorMap[colorMap.indexOf(tipColor)];
      }
      dataArr.push({ x: dataItem.x, y: dataItem.y });
      const tipPoint = document.createElement('div');
      const top = dirTop ? `${legendHeight + dataItem.y - 3}px` : `${dataItem.y - 3}px`;
      tipPoint.style.width = '6px';
      tipPoint.style.height = '6px';
      tipPoint.style.position = 'absolute';
      tipPoint.style.top = top;
      tipPoint.style.left = `${dataItem.x - 3}px`;
      tipPoint.style.backgroundColor = tipColor;
      tipPoint.style.borderRadius = '100%';
      tipPoint['z-index'] = 1000;
      tipPoint.className = 'tipPoint';
      parentContainer.appendChild(tipPoint);
    });
    const tipLinePoint = document.createElement('div');
    tipLinePoint.style.width = '6px';
    tipLinePoint.style.height = '6px';
    tipLinePoint.style.position = 'absolute';
    tipLinePoint.style.top = `${(dirTop ? legendHeight : 0) + parentCanvas.getClientRects()[0].height - config.padding[2] - 3}px`;
    tipLinePoint.style.left = `${tipLineX - 3}px`;
    tipLinePoint.style.backgroundColor = '#999';
    tipLinePoint.style.borderRadius = '100%';
    tipLinePoint['z-index'] = 1000;
    tipLinePoint.className = 'tipLine';
    parentContainer.appendChild(tipLinePoint);
  },
  // 清除参考线和点
  clearToolTip(elem) {
    const parentContainer = document.querySelector(`#aismcontainer-${elem.chartId}`);
    // 如果有辅助线，则清除
    if (parentContainer.querySelector('.tipLine')) {
      const tipLine = parentContainer.querySelectorAll('.tipLine');
      for (let j = 0; j < tipLine.length; j++) {
        if (tipLine[j]) parentContainer.removeChild(tipLine[j]);
      }
    }
    if (document.querySelector(`#${id}`)) {
      document.body.removeChild(document.querySelector(`#${id}`));
    }
  },
  chartTouchStart(e, chart, config, canvas, resultData, originData, elem, self) {
    const point = e.clientX
      ? getPoint(canvas, e.clientX, e.clientY)
      : getPoint(canvas, e.touches[0].clientX, e.touches[0].clientY);
    self.inMove = true;
    self.storePoint = point;
    // 根据画布坐标获取对应数据集
    const data = chart.getSnapRecords(point);
    const resultArr = [];
    data.forEach((i) => {
      resultArr.push({
        color: i.color,
        name: i._origin.type,
        value: i._origin.y
      });
    });
    self.renderPoint(config, data, resultArr, canvas, elem);

    // 点击的事件回调
    // if (config.onPressDown) {
    //   config.onPressDown(dataArr, config);
    // }
    if (!config.legend || (config.legend && config.legend.show !== false)) {
      elem.renderLegend('top', resultArr);
    }
  },
  chartTouchEnd(e, chart, config, canvas, resultData, originData, elem, self) {
    self.inMove = false;
    self.clearToolTip(elem);
  },
  // touchmove时候的事件处理
  chartTouchMove(e, chart, config, canvas, resultData, originData, elem, self) {
    if (self.inMove) {
      const point = e.clientX
        ? getPoint(canvas, e.clientX, e.clientY)
        : getPoint(canvas, e.touches[0].clientX, e.touches[0].clientY);

      const { storePoint } = self;
      // 根据画布坐标获取对应数据集
      const data = chart.getSnapRecords(point);
      const resultArr = [];
      data.forEach((i) => {
        resultArr.push({
          color: i.color,
          name: i._origin.type,
          value: i._origin.y
        });
      });
      if (storePoint && storePoint.x === point.x) {
        return;
      }
      self.clearToolTip(elem);
      self.renderPoint(config, data, resultArr, canvas, elem);
    }
  },
  afterRender(canvas, chart, config, props, elem) {
    const parentContainer = document.querySelector(`#aismcontainer-${elem.chartId}`);
    const legendContainer = document.querySelector(`#aismlegend${elem.chartId}`);
    const legendHeight = legendContainer.children.length ? legendContainer.getClientRects()[0].height : 0;
    const dirTop = config.legend.dir && config.legend.dir === 'top';
    const point = getPoint(canvas, 375, 0);
    const data = chart.getSnapRecords(point);
    const dataArr = [];
    if (config.showPointFirst !== false) {
      data.forEach((dataItem) => {
        let tipColor = dataItem.color;
        if (colorMap.indexOf(tipColor) >= 0) {
          tipColor = colorMap[colorMap.indexOf(tipColor)];
        }
        dataArr.push({ x: dataItem.x, y: dataItem.y });
        const tipPoint = document.createElement('div');
        tipPoint.style.width = '6px';
        tipPoint.style.height = '6px';
        tipPoint.style.position = 'absolute';
        tipPoint.style.left = `${dataItem.x - 3}px`;
        tipPoint.style.backgroundColor = tipColor;
        tipPoint.style.borderRadius = '100%';
        tipPoint['z-index'] = 1000;
        tipPoint.className = 'tipPoint';
        setTimeout(() => {
          tipPoint.style.top = dirTop ? `${legendHeight + dataItem.y - 3}px` : `${dataItem.y - 3}px`;

          parentContainer.appendChild(tipPoint);
        }, 50);
      });
    }
    const resultArr = [];
    data.forEach((i) => {
      resultArr.push({
        color: i.color,
        name: i._origin.type,
        value: i._origin.y
      });
    });

    if (!config.legend || (config.legend && config.legend.show !== false)) {
      elem.renderLegend('top', resultArr);
    }
  },
  afterChangeData(canvas, chart, config, props, elem) {
    const parentContainer = document.querySelector(`#aismcontainer-${elem.chartId}`);
    if (parentContainer.querySelector('.tipPoint')) {
      const tipPoints = parentContainer.querySelectorAll('.tipPoint');
      for (let j = 0; j < tipPoints.length; j++) {
        if (tipPoints[j]) parentContainer.removeChild(tipPoints[j]);
      }
    }
  }
};

export default f2Factory('F2Line', line);
