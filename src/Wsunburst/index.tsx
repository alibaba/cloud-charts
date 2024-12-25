'use strict';
import ReactDOM from 'react-dom';
import { View as DataView } from '@antv/data-set/lib/view';
import { get } from '@antv/util';
import { Chart, Types, BaseChartConfig, ChartData, G2Dependents, Colors } from '../common/types';
import Base from '../common/Base';
import { numberDecimal } from '../common/common';
import rectTooltip, { TooltipConfig } from '../common/rectTooltip';
import rectLegend, { LegendConfig } from '../common/rectLegend';
import geomStyle, { GeomStyleConfig } from '../common/geomStyle';
import polarLegendLayout from '../common/polarLegendLayout';
import updateChildrenPosition from '../common/updateChildrenPosition';
import errorWrap from '../common/errorWrap';
import { computeData } from '../common/utils/transformTreeNodeData';
import { FullCrossName } from '../constants';
import Wnumber from '../Wnumber';
import themes from '../themes/index';
import { drillDown } from '../common/interaction/drill-down';
import './index.scss';

export interface WsunburstConfig extends BaseChartConfig {
  colors?: Colors;
  legend?: LegendConfig | boolean;
  tooltip?: TooltipConfig | boolean;
  autoSort?: boolean;
  reverse?: boolean;
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
  innerContent?:
    | boolean
    | {
        /** 标题，不指定则取数据中name */
        title?: string | React.ReactNode;

        /** 数值，不指定则为数据总和 */
        value?: number | React.ReactNode;

        /** 单位 */
        unit?: string | React.ReactNode;
      };
  // 显示间隔线
  showSpacing?: boolean;
  select?: boolean;
}

function dodgeItems(data: ChartData, config: WsunburstConfig) {
  let newItems: G2Dependents.ListItem[] = undefined;
  if (config?.legend?.dodge && !config?.legend?.foldable && !config?.legend?.table) {
    newItems = [];
    // 这里用处理后的树数据
    // 默认只展示第一层
    // 暂时不支持自定义颜色
    data.forEach((subData: ChartData) => {
      if (subData.depth === 1) {
        newItems.push({
          id: subData?.id ?? subData?.name,
          name: subData?.name,
          value: subData?.name,
          marker: {
            symbol: 'circle',
            spacing: 4,
            style: {
              r: 3,
              fill: subData.color,
              lineAppendWidth: 0,
              fillOpacity: 1,
            },
          },
          unchecked: false,
        });
      }
    });
  } else if (config?.legend?.table && !config?.legend?.foldable && !config?.legend?.dodge) {
    newItems = [];
    data.forEach((subData: ChartData) => {
      newItems.push({
        id: subData?.id ?? subData?.name,
        name: subData?.name,
        value: subData?.name,
        marker: {
          symbol: 'circle',
          spacing: 4,
          style: {
            r: 3,
            fill: subData.color,
            lineAppendWidth: 0,
            fillOpacity: 1,
          },
        },
        unchecked: false,
      });
    });
  } else if (config?.legend?.items) {
    // 自定义优先级高于内置配置
    newItems = config.legend.items;
  }

  return newItems;
}

function deleteChildren(dom: HTMLElement) {
  let container = dom.getElementsByClassName(`${FullCrossName}-children`)?.[0];

  if (container) {
    dom.removeChild(container);
  }

  container = document.createElement('div');

  return container;
}

export class Sunburst extends Base<WsunburstConfig> {
  chartName = 'G2MultiPie';

  legendField = 'id';

  convertData = false;

  getDefaultConfig(): WsunburstConfig {
    return {
      colors: themes.category_12,
      // padding: [20, 20, 20, 20],
      legend: {
        position: 'right',
        align: 'center',
        // nameFormatter: null, // 可以强制覆盖，手动设置label
        // valueFormatter: null,
        // dodge: true,
        // showData: true,
        table: {
          statistics: ['current'],
          hideTitle: true
        },
        clickable: false
      },
      tooltip: {
        nameFormatter: null,
        valueFormatter: null,
      },
      cycle: false,
      innerRadius: 0.6, // 内环半径大小，仅cycle为true时可用
      outerRadius: 0.8, // 饼图半径大小，初始化时可用
      innerContent: true,
      autoSort: true, // 默认按大 -> 小排序
      reverse: false, // 是否逆序
      showSpacing: true, // 显示间隔
      select: true, // 选中下钻
      // drawPadding: [10, 10, 10, 10],
    };
  }

  totalData = 0;
  dataView: DataView = null;

  data: Types.Data = [];

  init(chart: Chart, config: WsunburstConfig, data: ChartData) {
    const { source, total } = computeData(data, config, this);

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

    // 多重圆环默认开启分组，这里通过自定义图例实现
    // 自定义图例会有更新问题
    const newItems: G2Dependents.ListItem[] = dodgeItems(source, config);

    rectLegend(
      this,
      chart,
      config,
      {
        items: newItems,
      },
      'single',
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
          const rootNode = pointData?.parentList?.[0];
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
      .polygon({
        // TODO 控制每一层的宽度占比
        // 多层饼图配置不生效
        // multiplePieWidthRatio: 1
      })
      .position('x*y')
      // 暂不支持自定义颜色
      .color('name*color', (xVal, yVal) => {
        return yVal;
      })
      .tooltip('name*value*rawValue*depth', (name, value) => {
        return {
          name,
          value,
        };
      });

    geomStyle(
      geom,
      config.geomStyle,
      (...args: any) => {
        const value = args[1] || args[2];
        const deep = args[3];
        const percent = args[4];
        return {
          // 增加圆环边线装饰
          stroke: themes['widgets-color-background'],
          lineWidth: config.showSpacing && value !== 0 && percent > 0.005 ? 1 : 0,
          cursor: config.select && deep === 1 && !this.isEmpty ? 'pointer' : 'default',
        }
      },
      'name*value*rawValue*depth*percent',
    );

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
      const container = deleteChildren(this.chartDom);
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
      deleteChildren(this.chartDom);
    }

    chart.on('afterpaint', () => {
      updateChildrenPosition(chart, this.chartDom);
    });

    drillDown(chart, (context: any, isCenter?: boolean) => {
      const { view } = context;
      const filterData = view.filteredData ?? [];
      const eventData = get(context, ['event', 'data', 'data']);

      if (!this.isEmpty) {
        let sum = 0;
        if (isCenter) {
          sum = this.totalData;
        } else {
          filterData.forEach((el: any) => {
            if (!el?.children) {
              sum += el?.value ?? 0;
            }
          })
        }
  
        const newContainer = deleteChildren(this.chartDom);
        newContainer.className = `${FullCrossName}-children`;
        const firstChild = this.chartDom.firstChild;
        this.chartDom.insertBefore(newContainer, firstChild);
        const content = (
          <Wnumber
            bottomTitle={config?.innerContent?.title ?? eventData?.name ?? this?.rawData?.name}
            unit={config?.innerContent?.unit ?? ''}
          >
            {config?.innerContent?.value ?? sum}
          </Wnumber>
        );
        ReactDOM.render(content, newContainer);
  
        updateChildrenPosition(chart, this.chartDom);
      }
    });
  }

  changeData(chart: Chart, config: WsunburstConfig, data: ChartData) {
    const { source, total } = computeData(data, config, this);
    this.totalData = total;

    // 多重圆环为自定义图例，需要根据数据重新计算
    const newItems: any = dodgeItems(source, config);
    chart.legend({
      items: newItems,
    });

    chart.changeData(source);

    // 环图中心内容
    if (
      config.cycle &&
      config.innerContent &&
      !this.props.children &&
      !this.props.loading &&
      !this.props.errorInfo
    ) {
      const container = deleteChildren(this.chartDom);

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

      updateChildrenPosition(chart, this.chartDom);
    }
  }
}

const WmultiPie: typeof Sunburst = errorWrap(Sunburst);
const Wsunburst: typeof Sunburst = errorWrap(Sunburst);

export { WmultiPie, Wsunburst };
