import { color } from '../theme/';

export const xAxisConfig = {
  // 设置坐标轴线的样式，如果值为 null，则不显示坐标轴线，图形属性
  line: {
    lineWidth: 1,
    stroke: color.widgetsAxisLine,
  },
  // 坐标轴文本距离轴线的距离
  labelOffset: 5,
  // 坐标点对应的线，null 不显示，图形属性
  tickLine: null,
  // 第一个点左对齐，最后一个点右对齐，其余居中，只有一个点时左对齐
  label: (text, index, total) => {
    const cfg = {
      fill: color.widgetsAxisLabel,
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
};

export const yAxisConfig = {
  custom: true,
  label: {
    fontSize: 10
  },
  labelOffset: -1
};

export const legendConfig = {
  show: true,
  // legend 显示位置，跟 F2 不一样的是支持 top 和 right
  position: 'top',
  showTitle: true,
  titleStyle: {
    fontSize: 12,
    fontWeight: 'normal',
    fill: color.widgetsLabelText,
  },
  showValue: true,
  valueStyle: {
    fontSize: 12,
    fill: color.widgetsLegendText,
    fontWeight: 'normal',
  },
  unCheckStyle: {
    fill: color.widgetsLegendUncheck,
  },
  marker: {
    radius: 14,
  }
};

export const tooltipConfig = {
  background: {
    fill: color.widgetsColorWhite
  }
};

export const appendPadding = [12, 0];
