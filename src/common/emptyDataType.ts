import themes from '../themes/index';

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
    emptyJudge: EmptyJudgeType.ARRAY, // 检测空数据的方式
    replacement: {
      // 空状态下替换的数据与配置项
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        padding: 0,
      },
    },
    fillBackground: false, // 是否填充背景色
  },
  // 箱型图
  G2Box: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        padding: 0,
      },
    },
    fillBackground: false,
  },
  // 烛形图
  G2Wcandlestick: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        padding: 0,
      },
    },
    fillBackground: false,
  },
  // 漏斗图
  G2Funnel: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      config: {
        padding: 0,
      },
    },
    fillBackground: true,
  },
  // 热力图
  G2Heatmap: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      config: {
        padding: 0,
      },
    },
    fillBackground: true,
  },
  // 层次图
  G2Hierarchy: {
    emptyJudge: EmptyJudgeType.CHILDREN,
    replacement: {
      data: {
        name: '',
        children: [],
      },
      config: {
        tooltip: false,
        colors: themes['widgets-color-layout-background'],
      },
    },
    fillBackground: true,
  },
  // 直方图
  G2Histogram: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        padding: 0,
      },
    },
    fillBackground: false,
  },
  // 线图
  G2Line: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        padding: 0,
      },
    },
    fillBackground: false,
  },
  // 线柱图
  G2LineBar: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: {
            style: {
              opacity: 0,
            },
            offset: -30,
          },
        },
        padding: 0,
      },
    },
    fillBackground: false,
  },
  // 线点图
  G2LineScatter: {
    emptyJudge: EmptyJudgeType.COMMON,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: {
            style: {
              opacity: 0,
            },
            offset: -30,
          },
        },
        padding: 0,
      },
    },
    fillBackground: false,
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
        colors: themes['widgets-color-layout-background'],
      },
    },
    fillBackground: false,
  },
  // 玫瑰图
  G2Nightingale: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [
        {
          x: 'a',
          y: 100,
        },
      ],
      config: {
        legend: false,
        tooltip: false,
        colors: themes['widgets-color-layout-background'],
        label: false,
      },
    },
    fillBackground: false,
  },
  // 饼图
  G2Pie: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [{ x: 'a', y: 100 }],
      config: {
        legend: false,
        tooltip: false,
        colors: themes['widgets-color-layout-background'],
        label: false,
      },
    },
    fillBackground: false,
  },
  // 雷达图
  G2Radar: {
    emptyJudge: EmptyJudgeType.ARRAY,
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
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        legend: false,
        tooltip: false,
        colors: themes['widgets-color-layout-background'],
      },
    },
    fillBackground: false,
  },
  // 分箱图
  G2Rectangle: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [{ x: 0, y: 0 }],
      config: {
        xAxis: false,
        yAxis: false,
        tooltip: false,
        legend: false,
      },
    },
    fillBackground: true,
  },
  // 桑基图
  G2Sankey: {
    emptyJudge: EmptyJudgeType.GRAPH,
    replacement: {
      data: {
        nodes: [],
        links: [],
      },
    },
    fillBackground: true,
  },
  // 散点图
  G2Scatter: {
    emptyJudge: EmptyJudgeType.ARRAY,
    replacement: {
      data: [],
      config: {
        xAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        yAxis: {
          min: 0,
          max: 100,
          label: false,
        },
        padding: 0,
      },
    },
    fillBackground: false,
  },
  // 树图
  G2Treemap: {
    emptyJudge: EmptyJudgeType.CHILDREN,
    replacement: {
      data: {
        name: '',
        children: [],
      },
      config: {
        tooltip: false,
        colors: themes['widgets-color-layout-background'],
      },
    },
    fillBackground: true,
  },
};

export default EmptyDataType;
