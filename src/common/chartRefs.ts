/** 通过chartRef对外暴露的函数 */
const getFunctions = (base: any, config: any) => ({
  /** 获取legend信息 */
  getLegendItems: () => {
    // 对线柱图、线点图等配置了items的情况，直接读取items
    if (base?.chart?.options?.legends?.items) {
      return base?.chart?.options?.legends?.items.map((item: any) => ({
        name: item.name,
        color: item?.marker?.style?.fill || item?.marker?.style?.stroke,
      }));
    }

    let data = [...base.chart.filteredData];
    base?.chart?.views.map((view: any) => {
      data = [...data, ...view.filteredData];
    });
    const { legendField = 'type' } = base;
    const names = Array.from(new Set(data?.map((d: any) => d[legendField])));
    return names.map((name: any, index: number) => {
      const color = config?.colors[index % config.colors.length];
      return {
        name,
        color,
      };
    });
  },

  /** 过滤数据 */
  filterDataByLegend: (condition: (value: any) => boolean) => {
    const { legendField = 'type' } = base;
    const views = [...base?.chart?.views, base.chart];
    views.forEach((view: any) => {
      view.filter(legendField, condition);
    });

    base.chart.render();
  },

  /** 高亮元素 */
  highlightElement: (condition: (value: any) => boolean) => {
    const views = [...base?.chart?.views, base.chart];
    views.forEach((view: any) => {
      view.getElements().forEach((element: any) => {
        const data = element.getData();
        if (condition(data)) {
          element.setState('active', true);
        } else {
          element.setState('inactive', true);
        }
      });
    });
  },

  /** 清除所有高亮状态 */
  clearHighlight: () => {
    const views = [...base?.chart?.views, base.chart];
    views.forEach((view: any) => {
      view.getElements().forEach((element: any) => {
        element.clearStates();
      });
    });
  },
});

export default (base: any, config: any) => {
  const ctx: any = {};

  Object.assign(ctx, getFunctions(base, config));

  return ctx;
};
