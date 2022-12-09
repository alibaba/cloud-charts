/**
 * 【数据量计算方法】
 *
 * 常规计算COMMON：每个data长度的最大值
 * 柱状图
 * 折线图
 * 饼图
 * 烛形图
 * 漏斗图
 * 线柱图
 * 线点图
 * 玫瑰图
 * 雷达图
 *
 * 直接计算个数COUNT: 直接计算数据个数
 * 箱型图
 *
 * 分层计算LEVEL: 计算每层个数，取最外层的数量
 * 多重饼图(多重环图)
 *
 * 计算所有数据总数SUM：计算所有data的总数
 * 散点图
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
  SUM: 'SUM',
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

const BigDataType: any = {
  // 柱状图
  G2Bar: {
    calculation: CalculationType.COMMON,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 15,
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
    calculation: CalculationType.COUNT,
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
    calculation: CalculationType.COMMON,
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
    calculation: CalculationType.COMMON,
    exceedJudge: [
      {
        type: ExceedJudgeType.LEGNTH,
        threshold: 30,
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
    calculation: CalculationType.COMMON,
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
    calculation: CalculationType.COMMON,
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
    calculation: CalculationType.SUM,
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
