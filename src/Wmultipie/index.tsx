'use strict';

import { View as DataView } from '@antv/data-set/lib/view';
import '@antv/data-set/lib/api/hierarchy';
import '@antv/data-set/lib/connector/hierarchy';
import '@antv/data-set/lib/transform/hierarchy/partition';
import { Chart, Types, BaseChartConfig, ChartData, G2Dependents, Colors } from '../common/types';
import Base from '../common/Base';
import themes from '../themes/index';
import { numberDecimal } from '../common/common';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import polarLegendLayout from '../common/polarLegendLayout';
import updateChildrenPosition from '../common/updateChildrenPosition';
import errorWrap from '../common/errorWrap';
import ReactDOM from 'react-dom';
import { FullCrossName } from '../constants';
import Wnumber from '../Wnumber';
import './index.scss';

interface WmultipieConfig extends BaseChartConfig {
  colors?: Colors;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  autoSort?: boolean;
  cycle?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  /**
   * 用于极坐标，配置起始弧度。
   */
  startAngle?: number;
  /**
   * 用于极坐标，配置结束弧度。
   */
  endAngle?: number;
  geomStyle?: GeomStyleConfig;
  /** 环形图中心的内容，仅当cycle=true时生效 */
  innerContent?: {
    /** 标题，不指定则取数据中name */
    title?: string | React.ReactNode;

    /** 数值，不指定则为数据总和 */
    value?: number | React.ReactNode;

    /** 单位 */
    unit?: string | React.ReactNode;
  };
}

function getParentList(
  node: Types.LooseObject,
  target: Types.LooseObject[] = [],
): Types.LooseObject[] {
  const parentNode = node.parent;
  // 需要存储根节点，所以一直到 parentNode===null（此时在根节点上）
  if (!parentNode) {
    return target;
  }

  target.unshift({
    name: parentNode.data.name,
    value: parentNode.value,
    rawValue: parentNode.data.value,
    depth: parentNode.depth,
  });

  return getParentList(parentNode, target);
}

function computeData(ctx: MultiPie, data: ChartData) {
  let dv = null;
  if (ctx.dataView) {
    dv = ctx.dataView;
    dv.source(data, {
      type: 'hierarchy',
    });
  } else {
    dv = new DataView();
    ctx.dataView = dv;

    dv.source(data, {
      type: 'hierarchy',
    }).transform({
      type: 'hierarchy.partition', // 根据树形数据生成相邻层次图 Adjacency Diagram 布局
      as: ['x', 'y'],
    });
  }

  const source: Types.Data = [];

  dv.getAllNodes().forEach((node) => {
    if (node.depth === 0) {
      // 父节点不展示
      return;
    }
    // var obj = {};
    // obj.name = node.data.name;
    // obj.rawValue = node.data.value;
    // obj.value = node.value;
    // obj.x = node.x;
    // obj.y = node.y;
    source.push({
      name: node.data.name,
      value: node.value,
      rawValue: node.data.value,
      depth: node.depth,
      parent: getParentList(node),
      x: node.x,
      y: node.y,
    });
    return node;
  });

  // 挂载转换后的数据
  ctx.data = source;

  return {
    source,
    total: dv?.root?.value ?? 0,
  };
}
export class MultiPie extends Base<WmultipieConfig> {
  chartName = 'G2MultiPie';

  legendField = 'name';

  convertData = false;

  getDefaultConfig(): WmultipieConfig {
    return {
      colors: themes.category_12,
      // padding: [20, 20, 20, 20],
      legend: {
        position: 'right',
        align: '',
        nameFormatter: null, // 可以强制覆盖，手动设置label
        valueFormatter: null,
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      cycle: false,
      innerRadius: 0.6, // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8, // 饼图半径大小，初始化时可用
      // drawPadding: [10, 10, 10, 10],
    };
  }

  totalData = 0;
  dataView: DataView = null;

  data: Types.Data = [];

  init(chart: Chart, config: WmultipieConfig, data: ChartData) {
    const { source, total } = computeData(this, data);

    this.totalData = total;

    chart.data(source);

    const thetaConfig: Types.CoordinateCfg = {
      radius: Math.max(Math.min(config.outerRadius, 1), 0.01),
    };
    if (config.startAngle !== undefined) {
      thetaConfig.startAngle = config.startAngle;
    }
    if (config.endAngle !== undefined) {
      thetaConfig.endAngle = config.endAngle;
    }
    if (config.cycle) {
      thetaConfig.innerRadius = Math.max(Math.min(config.innerRadius, 1), 0);
    }

    chart.coordinate('polar', thetaConfig);

    chart.axis(false);

    // 需要保证原始数据传入的时候按分组顺序传入
    // 这个是分组的顺序
    let dodgeGroups: string[] = [];
    // 如果开启图例分组，先判定数据中有分组信息
    let newItems: G2Dependents.ListItem[] = undefined;
    if (config?.legend?.dodge && !config?.legend?.foldable && !config?.legend?.table) {
      newItems = [];
      // 目前不遍历，和设计师沟通只做前两层
      if (this.rawData?.children) {
        this.rawData?.children?.forEach((subData: ChartData) => {
          if (
            subData?.dodge &&
            newItems?.filter((el) => el.dodge === subData?.dodge)?.length == 0
          ) {
            dodgeGroups.push(subData?.dodge || subData?.facet);
          }
        });
        this.rawData?.children
          ?.sort((a: any, b: any) => dodgeGroups.indexOf(a?.dodge) - dodgeGroups.indexOf(b?.dodge))
          .forEach((subData: ChartData, index: number) => {
            let rawColor;
            // 函数暂时不做处理，和默认数组处理方式保持一致
            if (typeof config?.colors === 'string') {
              rawColor = config?.colors;
            } else if (typeof config?.colors === 'object') {
              rawColor = config?.colors?.[index];
            } else if (typeof config?.colors === 'function') {
              rawColor = themes.category_12[index];
            }

            newItems.push({
              id: subData?.name,
              name: subData?.name,
              value: subData?.name,
              marker: {
                symbol: 'circle',
                spacing: 4,
                style: {
                  r: 3,
                  fill: rawColor,
                  lineAppendWidth: 0,
                  fillOpacity: 1,
                },
              },
              unchecked: false,
            });
          });
      }
    } else if (config?.legend?.items) {
      // 自定义优先级高于内置配置
      newItems = config.legend.items;
    }

    rectLegend(
      this,
      chart,
      config,
      {
        items: newItems,
      },
      true,
      null,
      true,
    );

    // tooltip
    rectTooltip(
      this,
      chart,
      config,
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
        shared: false,
      },
      (ev: any) => {
        const { items } = ev.data;
        items.forEach((item: any, index: number) => {
          if (typeof config.tooltip === 'boolean') {
            return;
          }

          const pointData = item.data;
          const rootNode = pointData.parent[0];
          const percent = numberDecimal(item.value / rootNode.value, 4);

          if (config.tooltip.valueFormatter) {
            item.value = config.tooltip.valueFormatter(
              item.value,
              {
                percent,
                ...pointData,
              },
              index,
              items,
            );
          }
          if (config.tooltip.nameFormatter) {
            item.name = config.tooltip.nameFormatter(
              item.name,
              {
                percent,
                ...pointData,
              },
              index,
              items,
            );
          }
        });
      },
      {
        showTitle: false,
        showMarkers: false,
        showCrosshairs: false,
        shared: false,
      },
    );

    const geom = chart
      .polygon()
      .position('x*y')
      .color('name', config.colors)
      .tooltip('name*value*rawValue*depth', (name, value) => {
        return {
          name,
          value,
        };
      });

    geomStyle(geom, config.geomStyle, undefined, 'name*value*rawValue*depth');

    polarLegendLayout(chart);

    // 环图中心内容
    if (
      config.cycle &&
      config.innerContent &&
      !this.props.children &&
      !this.isEmpty &&
      !this.props.loading &&
      !this.props.errorInfo
    ) {
      const container = document.createElement('div');
      container.className = `${FullCrossName}-children`;
      const firstChild = this.chartDom.firstChild;
      this.chartDom.insertBefore(container, firstChild);
      const content = (
        <Wnumber
          bottomTitle={config?.innerContent?.title ?? this.rawData?.name}
          unit={config?.innerContent?.unit ?? ''}
        >
          {config?.innerContent?.value ?? this.totalData}
        </Wnumber>
      );
      ReactDOM.render(content, container);
    } else if (!this.props.children) {
      // 删去中心内容
      const container = this.chartDom.getElementsByClassName(`${FullCrossName}-children`)?.[0];
      if (container) {
        this.chartDom.removeChild(container);
      }
    }

    chart.on('afterpaint', () => {
      updateChildrenPosition(chart, this.chartDom);
    });
  }

  changeData(chart: Chart, config: WmultipieConfig, data: ChartData) {
    const { source, total } = computeData(this, data);
    this.totalData = total;

    chart.changeData(source);

    // 环图中心内容
    if (
      config.cycle &&
      config.innerContent &&
      !this.props.children &&
      !this.props.loading &&
      !this.props.errorInfo
    ) {
      let container = this.chartDom.getElementsByClassName(`${FullCrossName}-children`)?.[0];
      if (!container) {
        container = document.createElement('div');
        container.className = `${FullCrossName}-children`;
        const firstChild = this.chartDom.firstChild;
        this.chartDom.insertBefore(container, firstChild);
      }
      const content = (
        <Wnumber
          bottomTitle={config?.innerContent?.title ?? this.rawData?.name}
          unit={config?.innerContent?.unit ?? ''}
        >
          {config?.innerContent?.value ?? this.totalData}
        </Wnumber>
      );
      ReactDOM.render(content, container);
    }
  }
}

const WmultiPie: typeof MultiPie = errorWrap(MultiPie);

export default WmultiPie;
