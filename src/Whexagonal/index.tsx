'use strict';

import { Chart, Types, BaseChartConfig, Colors } from '../common/types';
import Base from '../common/Base';
import { DataSet } from '@antv/data-set/lib/data-set';
import errorWrap from '../common/errorWrap';
import themes from '../themes/index';
import { propertyAssign, propertyMap } from '../common/common';
import rectXAxis, { XAxisConfig } from '../common/rectXAxis';
import rectYAxis, { YAxisConfig } from '../common/rectYAxis';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import { LabelConfig } from '../common/label';
import geomSize, { GeomSizeConfig } from '../common/geomSize';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import '@antv/data-set/lib/api/statistics';
import '@antv/data-set/lib/transform/bin/hexagon';

export interface WhexagonalConfig extends BaseChartConfig {
  colors?: Colors;
  xAxis?: (Types.ScaleOption & XAxisConfig) | false;
  yAxis?: (Types.ScaleOption & YAxisConfig) | false;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  label?: LabelConfig | boolean;
  size?: GeomSizeConfig;
  geomStyle?: GeomStyleConfig;
}

export class Hexagonal extends Base<WhexagonalConfig> {
  chartName = 'G2Hexagonal';
  getDefaultConfig(): WhexagonalConfig {
    return {
      colors: themes.order_10,
      tooltip: {
        titleFormatter: null,
        nameFormatter: null,
        valueFormatter: null,
      },
      legend: {
        align: 'left',
        nameFormatter: null, // 可以强制覆盖，手动设置label
      },
    };
  }

  init(chart: Chart, config: WhexagonalConfig, data: any) {
    // 设置数据度量
    const defs: Record<string, Types.ScaleOption> = {
      // x: propertyAssign(
      //   propertyMap.axis,
      //   {
      //     type: 'cat',
      //   },
      //   {
      //     visible: false,
      //   },
      // ),
      y: propertyAssign(
        propertyMap.axis,
        {},
        {
          visible: false,
          nice: true
        },
      ),
      count: {
        nice: true
      }
    };

    chart.scale(defs);

    const ds = new DataSet({
      state: {
        sizeEncoding: false,
      },
    });

    const hexagonalDataView = ds
      .createView()
      .source(this.rawData)
      .transform({
        // sizeByCount: '$state.sizeEncoding', // calculate bin size by binning count
        type: 'bin.hexagon',
        fields: ['x', 'y'], // 对应坐标轴上的一个点
        bins: [10, 5],
      });

    chart.data(hexagonalDataView.rows);

    // 设置X轴
    rectXAxis(this, chart, config);
    rectYAxis(this, chart, config);

    // 设置图例
    rectLegend(this, chart, config, {}, false, 'count');

    // tooltip
    rectTooltip(this, chart, config, {}, null, {
      showCrosshairs: false,
      showMarkers: false,
    });

    drawHexagonal(chart, config, config.colors);
  }
}

const Whexagonal: typeof Hexagonal = errorWrap(Hexagonal);
export default Whexagonal;

function drawHexagonal(chart: Chart, config: WhexagonalConfig, colors: Colors, field = 'count') {
  const { size } = config;

  const geom = chart.polygon().position(['x', 'y']).color(field, colors);

  geomSize(geom, size, null, 'y', 'y*count*extra');

  geomStyle(
    geom,
    config.geomStyle,
    {
      lineWidth: 2,
    },
    'y*count*extra',
  );
}
