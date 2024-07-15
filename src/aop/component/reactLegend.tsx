import { CategoryLegend, IGroup } from '@antv/g2/esm/dependents';
import ReactDOM from 'react-dom';
import React from 'react';
import { Chart } from '@antv/g2';
import TableLegend from './TableLegend';
import FoldableLegend from './FoldableLegend';
import GradientLegend from './GradientLegend';

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

    // 优先级：table > gradient > foldable
    const legend = this.legendConfig?.table ? (
      <TableLegend config={this.legendConfig} legendItems={items} chart={this.chart} />
    ) : this.legendConfig?.gradient ? (
      <GradientLegend config={this.legendConfig} legendItems={items} chart={this.chart} />
    ) : (
      <FoldableLegend config={this.legendConfig} legendItems={items} chart={this.chart} />
    );

    ReactDOM.render(legend, this.container);
  }
}

export default ReactLegend;
