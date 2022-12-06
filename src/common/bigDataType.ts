/**
 * 【数据量计算方法】
 *
 * 常规计算COMMON：{x, y, type, dodge, facet} 不同type单独统计，取最大值，忽略dodge与facet
 * 柱状图
 * 折线图
 * 饼图
 * 玫瑰图
 * 雷达图
 * 箱型图
 *
 * 直接计算个数COUNT: 直接取数组长度
 * 烛形图
 * 漏斗图
 * 散点图
 *
 * 特殊计算SPECIAL: [{name:'xxx',data:[], type: 'xxx', dodge: 'xxx'}] 取最大值
 * 线柱图
 * 线点图
 *
 * 分层计算LEVEL: 计算每层个数，取最外层的数量
 * 多重饼图(多重环图)
 *
 * 不考虑大数据情况：
 * 热力图（色块图）
 * 层次图
 * 直方图
 * 地图
 * 分箱图
 * 桑基图
 * 树图
 */
export const CalculationType = {
  COMMON: 'COMMON',
  COUNT: 'COUNT',
  SPECIAL: 'SPECIAL',
  LEVEL: 'LEVEL',
};

/**
 * 【数据量超标判断方法】
 *
 * 1.笛卡尔坐标系中，只考虑单坐标轴的长度LENGTH：宽度/数据个数<阈值（需判断是x轴还是y轴）
 *
 * 2.笛卡尔坐标系中，考虑整个坐标轴的面积AREA：宽度*高度/数据个数<阈值
 *
 * 3.极坐标系POLAR：半径<阈值
 *
 * 4.考虑数量NUMBER：数据个数>阈值
 *
 * 柱状图： 1 4
 * 折线图： 1
 * 烛形图： 1 4
 * 线柱图： 1 4
 * 线点图： 1 2
 * 箱型图： 1 4
 * 散点图： 2
 * 饼图： 3 4
 * 玫瑰图： 3 4
 * 雷达图： 3 4
 * 多重饼图： 3 4
 * 漏斗图： 1 4
 *
 */
export const ExceedJudgeType = {
  LEGNTH: 'LENGTH',
  AREA: 'AREA',
  POLAR: 'POLAR',
  NUMBER: 'NUMBER',
};

const BigDataType = {
  // 柱状图
  G2Bar: {
    calculation: CalculationType.COMMON, // 计算数据量的方式
    exceedJudge: [
      // 判断数据量是否超标的方式，可能有多个
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 15,
        directionConfig: 'column', // 是否水平方向的判断字段
        message: '该柱图柱子过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 30,
        message: '该柱图柱子数量过多，不利于数据间的比较，建议减少数据量或改用其他图表',
      },
    ],
    specialCases: [
      // 极坐标柱状图及玉玦图
      {
        config: {
          polar: true,
        },
        calculation: CalculationType.COMMON,
        exceedJudge: [
          /*
          {
            type: ExceedJudgeType.POLAR,
            threshold: 100,
            message: '该极坐标柱状图数据过于密集，会影响展示效果，建议加大图表半径',
          },
          */
          {
            type: ExceedJudgeType.NUMBER,
            threshold: 10,
            message: '该极坐标柱状图柱子过多，不利于数据间的比较，建议减少数据量或改用其他图表',
          },
        ],
      },
    ],
  },
  // 箱型图
  G2Box: {
    calculation: CalculationType.COMMON,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 50,
        message: '该箱型图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 20,
        message: '该箱型图数据量过多，不利于数据间的比较，建议减少数据量或改用其他图表',
      },
    ],
  },
  // 烛形图
  G2Wcandlestick: {
    calculation: CalculationType.COUNT,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 8,
        message: '该烛形图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 100,
        message: '该烛形图数据量过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  // 漏斗图
  G2Funnel: {
    calculation: CalculationType.COUNT,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 30,
        directionConfig: 'direction',
        message: '该漏斗图数据过于密集，会影响展示效果，建议减少数据量或加大图表尺寸',
      },
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 10,
        message: '该漏斗图数据量过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  // 线图
  G2Line: {
    calculation: CalculationType.COMMON,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 4,
        message: '该线图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
    ],
  },
  // 线柱图
  G2LineBar: {
    calculation: CalculationType.SPECIAL,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 15,
        message: '该线柱图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
    ],
  },
  // 线点图
  G2LineScatter: {
    calculation: CalculationType.SPECIAL,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 10,
        message: '该线点图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
    ],
  },
  // 多重饼图
  G2MultiPie: {
    calculation: CalculationType.LEVEL,
    exceedJudge: [
      /*
      {
        type: ExceedJudgeType.POLAR,
        threshold: 100,
        message: '该多重饼图数据过于密集，会影响展示效果，建议加大图表半径',
      },
      */
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 20,
        message: '该多重饼图分块过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  // 玫瑰图
  G2Nightingale: {
    calculation: CalculationType.COMMON,
    exceedJudge: [
      /*
      {
        type: ExceedJudgeType.POLAR,
        threshold: 100,
        message: '该玫瑰图数据过于密集，会影响展示效果，建议减少数据量或加大图表半径',
      },
      */
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 15,
        message: '该玫瑰图分块过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  // 饼图
  G2Pie: {
    calculation: CalculationType.COMMON,
    exceedJudge: [
      /*
      {
        type: ExceedJudgeType.POLAR,
        threshold: 80,
        message: '该饼图数据过于密集，会影响展示效果，建议减少数据量或加大图表半径',
      },
      */
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 10,
        message: '该饼图分块过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  // 雷达图
  G2Radar: {
    calculation: CalculationType.COMMON,
    exceedJudge: [
      /*
      {
        type: ExceedJudgeType.POLAR,
        threshold: 100,
        message: '该雷达图数据过于密集，会影响展示效果，建议减少数据量或加大图表半径',
      },
      */
      {
        type: ExceedJudgeType.NUMBER,
        threshold: 30,
        message: '该雷达图分块过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  // 散点图
  G2Scatter: {
    calculation: CalculationType.COUNT,
    exceedJudge: [
      {
        type: ExceedJudgeType.AREA,
        threshold: 300,
        message: '该散点图数据过于密集，会影响展示效果，建议减少数据量或加大图表尺寸',
      },
    ],
  },
};

export default BigDataType;
