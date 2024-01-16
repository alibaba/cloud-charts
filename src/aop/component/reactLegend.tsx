import { CategoryLegend, IGroup } from '@antv/g2/esm/dependents';
import ReactDOM from 'react-dom';
import React from 'react';
import { Chart } from '@antv/g2';
import TableLegend from './TableLegend';
import FoldableLegend from './FoldableLegend';
import { FullCrossName } from '../../constants';

// @ts-ignore
class ReactLegend extends CategoryLegend {
  private parentDom: HTMLElement;

  private chart: Chart;

  private legendConfig: any;

  constructor(props: any) {
    const { cfg, parentDom, chart, legendConfig } = props;
    super(cfg);

    this.parentDom = parentDom;

    this.chart = chart;

    this.legendConfig = legendConfig;
  }

  protected drawLegendContent(group: IGroup) {
    let container = this.parentDom.getElementsByClassName('widgets-legend')?.[0] as HTMLElement;

    if (!container) {
      container = document.createElement('div');
      container.className = `${FullCrossName} widgets-legend`;
      const align = this.legendConfig?.position?.split('-')?.[1] ?? 'center';
      const direction = align === 'center' ? 'center' : align === 'left' || align === 'top' ? 'flex-start' : 'flex-end';
      container.style.cssText = `width: 100%; display: flex; justify-content: ${direction}; align-items: ${direction}; overflow-x: auto;overflow-y: hidden;`;
      this.parentDom.appendChild(container);
    }

    const items = this.get('items');
    // const currentPoint = this.get('currentPoint');
    // const startX = currentPoint.x;
    // const startY = currentPoint.y;

    const legend = this.legendConfig?.table ? (
      <TableLegend config={this.legendConfig} legendItems={items} chart={this.chart} />
    ) : (
      <FoldableLegend config={this.legendConfig} legendItems={items} chart={this.chart} />
    );

    ReactDOM.render(legend, container);
  }
}

export default ReactLegend;
