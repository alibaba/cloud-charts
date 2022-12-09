/**
 * 判断是否无数据的方法分类
 *  COMMON    {name: xxx, data: [xxx]}
 *  ARRAY    [{x: ... , y: ...}]
 *  CHILDREN  { children: [xxx]}
 *  GRAPH    { nodes: [xxx], links: [xxx]}
 */
export const EmptyJudgeType = {
  COMMON: 'COMMON',
  ARRAY: 'ARRAY',
  CHILDREN: 'CHILDREN',
  GRAPH: 'GRAPH',
};

const EmptyDataType = {
  // 柱状图
  G2Bar: {
    emptyJudge: EmptyJudgeType.COMMON, // 检测空数据的方式
    replacement: {
      // 空状态下替换的数据与配置项
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: null,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: null,
        },
      },
    },
  },
  // 箱型图
  G2Box: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: null,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: null,
        },
      },
    },
  },
  // 烛形图
  G2Wcandlestick: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: null,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: null,
        },
      },
    },
  },
  // 漏斗图
  G2Funnel: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {},
  },
  // 热力图
  G2Heatmap: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {},
  },
  // 层次图
  G2Hierarchy: {
    emptyJudge: EmptyJudgeType.CHILDREN,
    replacement: {},
  },
  // 直方图
  G2Histogram: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: null,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: null,
        },
      },
    },
  },
  // 线图
  G2Line: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: null,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: null,
        },
      },
    },
  },
  // 线柱图
  G2LineBar: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {},
  },
  // 线点图
  G2LineScatter: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {},
  },
  // 地图
  // G2Map: {
  //   emptyJudge: EmptyJudgeType.COMMON,
  //   replacement: {},
  // },
  // 多重饼图
  G2MultiPie: {
    emptyJudge: EmptyJudgeType.CHILDREN,
    replacement: {
      data: {
        children: [
          {
            name: 'root',
            value: 100,
          },
        ],
      },
      config: {
        legend: false,
        colors: '#F7F7F7',
      },
    },
  },
  // 玫瑰图
  G2Nightingale: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {},
  },
  // 饼图
  G2Pie: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {}, // 饼图无需替换数据与配置项
  },
  // 雷达图
  G2Radar: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [
        { x: 'a', y: 0 },
        { x: 'b', y: 0 },
        { x: 'c', y: 0 },
        { x: 'd', y: 0 },
        { x: 'e', y: 0 },
        { x: 'f', y: 0 },
      ],
      config: {
        xAxis: {
          label: null,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: null,
        },
        legend: false,
        tooltip: false,
        colors: '#e6e6e6',
      },
    },
  },
  // 分箱图
  G2Rectangle: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {},
  },
  // 桑基图
  G2Sankey: {
    emptyJudge: EmptyJudgeType.GRAPH,
    replacement: {},
  },
  // 散点图
  G2Scatter: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: null,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: null,
        },
      },
    },
  },
  // 树图
  G2Treemap: {
    emptyJudge: EmptyJudgeType.CHILDREN,
    replacement: {},
  },
};

export default EmptyDataType;
