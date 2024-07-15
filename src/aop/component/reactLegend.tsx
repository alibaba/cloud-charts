import { CategoryLegend, IGroup } from '@antv/g2/esm/dependents';
import ReactDOM from 'react-dom';
import React from 'react';
import { Chart } from '@antv/g2';
import TableLegend from './TableLegend';
import FoldableLegend from './FoldableLegend';
import GradientLegend from './GradientLegend';

// 优先级：table > gradient > foldable
function switchLegendComponent(config: any, items: any, chart: Chart) {
  if (config?.table) {
    return <TableLegend config={config} legendItems={items} chart={chart} />;
  } else if (config?.gradient) {
    return <GradientLegend config={config} legendItems={items} chart={chart} />;
  } else if (config?.foldable) {
    return <FoldableLegend config={config} legendItems={items} chart={chart} />;
  }

  return <TableLegend config={config} legendItems={items} chart={chart} />;
}

// @ts-ignore
class ReactLegend extends CategoryLegend {
  private container: HTMLElement;

  private chart: Chart;

  private legendConfig: any;

  constructor(props: any) {
    const { cfg, container, chart, legendConfig } = props;
    super(cfg);

    this.container = container;

    this.chart = chart;

    this.legendConfig = legendConfig;
  }

  protected drawLegendContent(group: IGroup) {
    const items = this.get('items');
    // const currentPoint = this.get('currentPoint');
    // const startX = currentPoint.x;
    // const startY = currentPoint.y;

    const LegendRender = switchLegendComponent(this.legendConfig, items, this.chart);
    ReactDOM.render(LegendRender, this.container);
  }
}

export default ReactLegend;
