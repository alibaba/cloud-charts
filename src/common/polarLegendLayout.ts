import defaultLayout from '@antv/g2/esm/chart/layout';
import { Chart } from '../common/types';

/**
 * polarLegendLayout 极坐标系图例布局函数
 *
 * @param {Chart} chart 图表实例
 * */
export default function polarLegendLayout(chart: Chart) {
  chart.setLayout(() => {
    // 先运行默认 layout
    defaultLayout(chart);
    /*
    const axis = chart.getController('axis');
    const legend = chart.getController('legend');
    const annotation = chart.getController('annotation');
    const slider = chart.getController('slider');
    const scrollbar = chart.getController('scrollbar');

    // 根据最新的 coordinate 重新布局组件
    [axis, slider, scrollbar, legend, annotation].forEach((controller: Controller) => {
      if (controller) {
        controller.layout();
      }
    });
    */

    const legendComponents = chart.getController('legend').getComponents();
    if (legendComponents.length === 0) {
      return;
    }
    const radius = chart.getCoordinate().radius
    const legend = legendComponents[0].component;
    const legendPadding = legend.cfg.padding;
    const [legendPosition] = legend.cfg?.position?.split('-') || ['right'];
    if (legendPosition === 'top' || legendPosition === 'bottom') {
      return;
    }
    // 计算一个合适的 legend 位置
    // 1. legend 的宽高
    const legendBBox = legend.getLayoutBBox();
    // 2. 饼的宽高
    const pieSize = Math.min(chart.coordinateBBox.width, chart.coordinateBBox.height) * radius; // coordinate radius
    // 图表左右剩余空间的一半宽度
    const emptyAreaHalfWidth = (chart.width - pieSize - (legendBBox.width + legendPadding[1] + legendPadding[3])) / 2;
    // console.log(pieSize, legend, legendBBox);
    // 下面的 x y 就是数学题了，可视化中所有定位的参考点是自己的左上角。
    legend.update({
      x: legendPosition === 'left' ? emptyAreaHalfWidth : emptyAreaHalfWidth + pieSize + legendPadding[3],
      // x: chart.width - (chart.width / 2 - pieSize / 2 ) / 2 - legendBBox.width / 2,
      // y: chart.height / 2 - legendBBox.height / 2,
    });
  });
}
