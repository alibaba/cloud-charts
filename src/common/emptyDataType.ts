export const ProcessType = {
  RECT: 'RECT', // 直角坐标系
  POLAR: 'POLAR', // 极坐标系
  RADAR: 'RADAR', // 雷达图
  OTHERS: 'OTHERS', // 其他
};

const EmptyDataType = {
  // 柱状图
  G2Bar: ProcessType.RECT,
  // 箱型图
  G2Box: ProcessType.RECT,
  // 烛形图
  G2Wcandlestick: ProcessType.RECT,
  // 漏斗图
  G2Funnel: ProcessType.OTHERS,
  // 热力图
  G2Heatmap: ProcessType.OTHERS,
  // 层次图
  G2Hierarchy: ProcessType.OTHERS,
  // 直方图
  G2Histogram: ProcessType.RECT,
  // 线图
  G2Line: ProcessType.RECT,
  // 线柱图
  G2LineBar: ProcessType.RECT,
  // 线点图
  G2LineScatter: ProcessType.RECT,
  // 地图
  G2Map: ProcessType.OTHERS,
  // 多重饼图
  G2MultiPie: ProcessType.POLAR,
  // 玫瑰图
  G2Nightingale: ProcessType.POLAR,
  // 饼图
  G2Pie: ProcessType.POLAR,
  // 雷达图
  G2Radar: ProcessType.RADAR,
  // 分箱图
  G2Rectangle: ProcessType.OTHERS,
  // 桑基图
  G2Sankey: ProcessType.OTHERS,
  // 散点图
  G2Scatter: ProcessType.RECT,
  // 树图
  G2Treemap: ProcessType.OTHERS,
};

export default EmptyDataType;
