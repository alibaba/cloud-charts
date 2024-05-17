import { Chart, Element, View } from '@antv/g2';
import { Datum } from '@antv/g2/esm/interface';
import { ListItem } from '@antv/g2/esm/dependents';

/** 计算每个legend的统计数据 */
export function getStatistics(
  chart: Chart,
  statistics: Array<'min' | 'max' | 'avg' | 'current'>,
  legendField: string,
  dataType?: string
) {
  // 业务偶现chart为null，导致filteredData无法获取的报错，暂不清楚原因，这里增加兜底逻辑
  // @ts-ignore
  let data = [...(chart?.filteredData ?? [])];
  chart?.views.map((view: View) => {
    // @ts-ignore
    data = [...data, ...(view?.filteredData ?? [])];
  });

  // 将每类数据分类
  const items: Record<string, Datum[]> = {};
  data.forEach((item: Datum) => {
    const legendName = item[legendField];
    if (!(legendName in items)) {
      items[legendName] = [];
    }
    items[legendName].push(item);
  });

  const res: Record<string, any> = {};
  Object.keys(items).forEach((name: string) => {
    let yValues = items[name].map((item: Datum) => item.y);

    if (dataType === 'treeNode') {
      yValues = [items[name].map((item: Datum) => item.value)];
    }

    const statisticsRes: any = {};
    statistics.forEach((statistic) => {
      if (statistic === 'min') {
        statisticsRes.min = Math.min(...yValues);
      } else if (statistic === 'max') {
        statisticsRes.max = Math.max(...yValues);
      } else if (statistic === 'avg') {
        statisticsRes.avg =
          yValues.reduce((pre: number, cur: number) => pre + cur, 0) / yValues.length;
      } else {
        statisticsRes.current = yValues[yValues.length - 1];
      }
    });
    res[name] = statisticsRes;
  });

  return res;
}

/** 过滤legend */
export function filterLegend(
  chart: Chart,
  condition: (value: any) => boolean,
  legendField: string,
) {
  const views = [...chart?.views, chart];
  views.forEach((view: View) => {
    view?.getComponents()?.forEach((co: any) => {
      if (co.type === 'legend') {
        const items = co.component.getItems();
        items.forEach((item: ListItem) => {
          if (condition(item.id || item.name)) {
            co.component.setItemState(item, 'checked', true);
            co.component.setItemState(item, 'unchecked', false);
          } else {
            co.component.setItemState(item, 'checked', false);
            co.component.setItemState(item, 'unchecked', true);
          }
        });
      }
    });
    view.filter(legendField, condition);
  });

  chart.render();
}

/** 高亮legend */
export function highlightLegend(
  chart: Chart,
  condition: (value: any) => boolean,
  legendField: string,
) {
  const views = [...chart?.views, chart];
  views.forEach((view: View) => {
    view?.getComponents()?.forEach((co: any) => {
      if (co.type === 'legend') {
        const items = co.component.getItems();
        items.forEach((item: ListItem) => {
          if (condition(item.id || item.name)) {
            co.component.setItemState(item, 'active', true);
            co.component.setItemState(item, 'inactive', false);
          } else {
            co.component.setItemState(item, 'active', false);
            co.component.setItemState(item, 'inactive', true);
          }
        });
      }
    });
    view.getElements().forEach((element: Element) => {
      const data = element.getData();
      const name = data?.[legendField] ?? data?.[0]?.[legendField];
      if (condition(name)) {
        element.setState('active', true);
      } else {
        element.setState('inactive', true);
      }
    });
  });
}

/** 清除高亮 */
export function clearHighlight(chart: Chart) {
  const views = [...chart?.views, chart];
  views.forEach((view: View) => {
    view?.getComponents()?.forEach((co: any) => {
      if (co.type === 'legend') {
        const items = co.component.getItems();
        items.forEach((item: ListItem) => {
          co.component.setItemState(item, 'active', false);
          co.component.setItemState(item, 'inactive', false);
        });
      }
    });
    view.getElements().forEach((element: Element) => {
      element.clearStates();
    });
  });
}

/** 通过chartRef对外暴露的函数 */
const getFunctions = (base: any, config: any) => ({
  /** 获取chart实例 */
  getChart: () => base.chart,

  /** 获取legend信息，包括名称、颜色及改列数据统计信息 */
  getLegendItems: (statistics: Array<'min' | 'max' | 'avg' | 'current'> = []) => {
    const { chart, legendField = 'type' } = base;
    const statisticsRes = getStatistics(chart, statistics, legendField);

    // 对线柱图、线点图等配置了items的情况，直接读取items
    if (base?.chart?.options?.legends?.items) {
      return base?.chart?.options?.legends?.items.map((item: ListItem) => ({
        name: item.id || item.name,
        color: item?.marker?.style?.fill || item?.marker?.style?.stroke,
        ...statisticsRes[item.id || item.name],
      }));
    }

    return Object.keys(statisticsRes).map((name: string, index: number) => {
      const color =
        typeof config?.colors === 'function'
          ? config?.colors(name)
          : config?.colors[index % config.colors.length];
      return {
        name,
        color,
        ...statisticsRes[name],
      };
    });
  },

  /** 过滤数据 */
  filterLegend: (condition: (value: any) => boolean) => {
    const { legendField = 'type' } = base;
    filterLegend(base.chart, condition, legendField);
  },

  /** 高亮元素 */
  highlightLegend: (condition: (value: any) => boolean) => {
    const { legendField = 'type' } = base;
    highlightLegend(base.chart, condition, legendField);
  },

  /** 清除所有高亮状态 */
  clearHighlight: () => {
    clearHighlight(base.chart);
  },
});

export default (base: any, config: any) => {
  const ctx: any = {};

  Object.assign(ctx, getFunctions(base, config));

  return ctx;
};
