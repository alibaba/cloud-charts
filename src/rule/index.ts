import {
  IBigData,
  BigDataJudgement,
  processBarBigData,
  processLineBigData,
  processPieBigData,
} from './bigData';
import { DataStructure } from './data';
import { EmptyDataProcess } from './emptyData';
import {
  processBarExtremeData,
  processLineExtremeData,
  processLPieExtremeData,
} from './extremeData';
import { runDataRules } from './dataRules';
import { numberDecimal } from '../common/common';

/** 坐标系 */
export enum Coordinate {
  // 笛卡尔坐标系
  Cartesian,
  // 极坐标系
  Polar,
  // 其他
  Others,
}

export interface IChartRule {
  /** 图表id */
  id: string;

  /** 图表名称 */
  name: string;

  /** 将父类分成子类的函数，基础类型返回父类id，子类返回所属子类的id，未录入规则的子类返回空字符串 */
  classify?: (data: any, config: any) => string;

  /** 坐标系类型 */
  coord?: Coordinate;

  /** 主轴 */
  mainAxis?: 'x' | 'y';

  /** 数据结构 */
  dataStructure?: DataStructure;

  /** 空数据处理类型 */
  emptyData?: EmptyDataProcess;

  /** 大数据处理 */
  bigData?: {
    /** 判断条件 */
    judgements: IBigData[];
    /** 大数据时的处理方式，返回config */
    process?: (chartObj: any, data: any) => any;
  };

  /** 极端数据处理，由于不同图表差异极大，此处用函数 */
  extremeData?: (chartObj: any, config: any, data: any) => { isExtreme: boolean; config?: any };

  /** 子类 */
  children?: Record<string, IChartRule>;

  /** 处理配置（前置） */
  processConfig?: (config: any) => any;

  /** 处理数据 */
  processData?: (data: any, config: any) => any;
}

/** 柱图 */
const barChart: IChartRule = {
  id: 'bar_chart',
  name: '柱状图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Common,
  // 将父类分成子类的分类函数
  classify: (data: any, config: any) => {
    // 判断方向，横向还是纵向
    const isColumn = config?.column === undefined || config?.column === true;

    // 判断是否是区间柱图
    const isInterval = data?.some((item: any) => Array.isArray(item.y));

    // 判断是否是极坐标柱图
    const isPolar = !!config?.polar;

    // 判断是否是镜面柱图
    const isFacet = !!config?.facet && new Set(data.map((item: any) => item.facet)).size > 1;

    // 判断是否是百分比柱图
    const isPercentage = !!config?.percentage;

    // 判断是否是分组堆叠
    const hasDodges = new Set(data.map((item: any) => item.dodge)).size > 1;
    const isDodgeStack = !!config?.dodgeStack && hasDodges;

    // 判断是否是堆叠图
    const isStack = !isDodgeStack && !!config?.stack;

    // 判断是否是分组柱图
    const isDodge = !isDodgeStack && !isStack && !!config?.dodge && hasDodges;

    // 编码
    const code = `${isColumn ? 1 : 0}${isInterval ? 1 : 0}${isPolar ? 1 : 0}${isFacet ? 1 : 0}${
      isPercentage ? 1 : 0
    }${isDodgeStack ? 1 : 0}${isStack ? 1 : 0}${isDodge ? 1 : 0}`;

    // 映射
    const chartMap = {
      // 普通柱图
      '10000000': 'bar_chart',
      // 横向柱图
      '00000000': 'horizontal_bar_chart',
      // 区间柱状图
      '11000000': 'interval_bar_chart',
      // 横向区间柱状图
      '01000000': 'horizontal_interval_bar_chart',
      // 堆叠柱状图
      '10000010': 'stacked_bar_chart',
      // 横向堆叠柱状图
      '00000010': 'horizontal_stacked_bar_chart',
      // 百分比堆叠柱状图
      '10001010': 'percentage_bar_chart',
      // 分组堆叠柱状图
      '10000100': 'grouped_stacked_bar_chart',
      // 分组百分比堆叠柱状图
      '10001100': 'grouped_percentage_stack_bar_chart',
      // 镜面柱面
      '10010000': 'facet_bar_chart',
      // 横向镜面柱图
      '00010000': 'horizontal_facet_bar_chart',
      // 极坐标柱状图
      '10100000': 'polar_bar_chart',
      // 玉玦图（极坐标横向柱状图）
      '00100000': 'polar_horizontal_bar_chart',
      // 极坐标堆叠柱状图
      '10100010': 'polar_stacked_bar_chart',
    };

    return (chartMap as any)?.[code] ?? 'bar_chart';
  },
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 15,
        message:
          '该柱图柱子过于密集，会影响展示效果，建议减少数据量或加大图表宽度。推荐开启缩略轴slider配置或滚动条scrollbar配置，问题码#05-2',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 30,
        message:
          '该柱图柱子数量过多，不利于数据间的比较，建议减少数据量或加大图表宽度。推荐开启缩略轴slider配置或滚动条scrollbar配置，如轴文本太长也可开启autoEllipsis配置项。问题码#05-2',
      },
    ],
    process: processBarBigData,
  },
  extremeData: processBarExtremeData,
  children: {
    horizontal_bar_chart: {
      id: 'horizontal_bar_chart',
      name: '横向柱状图',
      mainAxis: 'y',
      bigData: {
        judgements: [
          {
            type: BigDataJudgement.Length,
            threshold: 30,
            message: '该柱图柱子过于密集，会影响展示效果，建议减少数据量或加大图表高度',
          },
          {
            type: BigDataJudgement.Number,
            threshold: 15,
            message: '该柱图柱子数量过多，不利于数据间的比较，建议减少数据量或加大图表高度',
          },
        ],
      },
      extremeData: null,
    },
    interval_bar_chart: {
      id: 'interval_bar_chart',
      name: '区间柱状图',
      extremeData: null,
    },
    horizontal_interval_bar_chart: {
      id: 'horizontal_interval_bar_chart',
      name: '横向区间柱状图',
      mainAxis: 'y',
      bigData: {
        judgements: [
          {
            type: BigDataJudgement.Length,
            threshold: 30,
            message: '该柱图柱子过于密集，会影响展示效果，建议减少数据量或加大图表高度',
          },
          {
            type: BigDataJudgement.Number,
            threshold: 15,
            message: '该柱图柱子数量过多，不利于数据间的比较，建议减少数据量或加大图表高度',
          },
        ],
      },
      extremeData: null,
    },
    stacked_bar_chart: {
      id: 'stacked_bar_chart',
      name: '堆叠柱状图',
    },
    horizontal_stacked_bar_chart: {
      id: 'horizontal_stacked_bar_chart',
      name: '横向堆叠柱状图',
      mainAxis: 'y',
      bigData: {
        judgements: [
          {
            type: BigDataJudgement.Length,
            threshold: 30,
            message: '该柱图柱子过于密集，会影响展示效果，建议减少数据量或加大图表高度',
          },
          {
            type: BigDataJudgement.Number,
            threshold: 15,
            message: '该柱图柱子数量过多，不利于数据间的比较，建议减少数据量或加大图表高度',
          },
        ],
      },
      extremeData: null,
    },
    percentage_bar_chart: {
      id: 'percentage_bar_chart',
      name: '百分比堆叠柱状图',
    },
    grouped_stacked_bar_chart: {
      id: 'grouped_stacked_bar_chart',
      name: '分组堆叠柱状图',
    },
    grouped_percentage_stack_bar_chart: {
      id: 'grouped_percentage_stack_bar_chart',
      name: '分组百分比堆叠柱状图',
    },
    facet_bar_chart: {
      id: 'facet_bar_chart',
      name: '镜面柱图',
      extremeData: null,
    },
    horizontal_facet_bar_chart: {
      id: 'horizontal_facet_bar_chart',
      name: '横向镜面柱图',
      mainAxis: 'y',
      extremeData: null,
    },
    polar_bar_chart: {
      id: 'polar_bar_chart',
      name: '极坐标柱状图',
      coord: Coordinate.Polar,
      bigData: {
        judgements: [
          {
            type: BigDataJudgement.Polar,
            threshold: 100,
            message: '该极坐标柱图半径过小，会影响展示效果，建议加大图表尺寸',
          },
          {
            type: BigDataJudgement.Number,
            threshold: 15,
            message: '该极坐标柱图柱子数量过多，不利于数据间的比较，建议减少数据量或改用普通柱图',
          },
        ],
      },
      extremeData: null,
    },
    polar_horizontal_bar_chart: {
      id: 'polar_horizontal_bar_chart',
      name: '极坐标横向柱状图',
      bigData: {
        judgements: [
          {
            type: BigDataJudgement.Polar,
            threshold: 100,
            message: '该极坐标柱图半径过小，会影响展示效果，建议加大图表尺寸',
          },
          {
            type: BigDataJudgement.Number,
            threshold: 10,
            message:
              '该极坐标横向柱图柱子数量过多，不利于数据间的比较，建议减少数据量或改用普通柱图',
          },
        ],
      },
      extremeData: null,
    },
    polar_stacked_bar_chart: {
      id: 'polar_stacked_bar_chart',
      name: '极坐标堆叠柱图',
      bigData: {
        judgements: [
          {
            type: BigDataJudgement.Polar,
            threshold: 100,
            message: '该极坐标柱图半径过小，会影响展示效果，建议加大图表尺寸',
          },
          {
            type: BigDataJudgement.Number,
            threshold: 15,
            message: '该极坐标柱图柱子数量过多，不利于数据间的比较，建议减少数据量或改用普通柱图',
          },
        ],
      },
      extremeData: null,
    },
  },
  processConfig: (config: any) => {
    let finalConfig = config;

    // 处理百分比柱图的y轴%展示
    if (!Array.isArray(finalConfig?.yAxis) && finalConfig.percentage && !finalConfig.yAxis.labelFormatter) {
      const customFormatter = finalConfig.yAxis?.labelFormatter;
      finalConfig = {
        ...finalConfig,
        yAxis: {
          ...finalConfig?.yAxis,
          min: 0,
          max: 1,
          labelFormatter: (value: any) => {
            return customFormatter
              ? customFormatter(value)
              : numberDecimal(value * 100, finalConfig?.decimal) + '%';
          },
        },
      };
    }

    // 线图与柱图当同时使用自定义legend与slider时，切换为默认legend
    // 临时方案，自定义legend与slider无法兼容，待修复bug后删除
    if (
      (finalConfig?.legend?.foldable ||
        finalConfig?.legend?.table ||
        finalConfig?.legend?.gradient) &&
      finalConfig?.slider
    ) {
      finalConfig = {
        ...finalConfig,
        legend: {
          ...finalConfig?.legend,
          foldable: false,
          table: false,
          gradient: false,
        },
      };
    }

    return finalConfig;
  },
  processData: (data: any, config: any) => {
    return runDataRules(data, config);
  },
};

/** 线图 */
const lineChart: IChartRule = {
  id: 'line_chart',
  name: '线图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Common,
  classify: (data: any, config: any) => {
    // 是否是阶梯线图
    const isStep = !!config?.step;

    // 是否是平滑线图
    const isSpline = !!config?.spline;

    // 是否是面积图
    const isArea = !!config?.area;

    // 是否堆叠（仅area时生效)
    const isStack = !!config?.stack;

    // 是否是区域线图
    const isInterval = data?.some((item: any) => Array.isArray(item.y));

    // 编码
    const code = `${isStep ? 1 : 0}${isSpline ? 1 : 0}${isArea ? 1 : 0}${isStack ? 1 : 0}${
      isInterval ? 1 : 0
    }`;

    // 映射
    const chartMap = {
      // 普通线图
      '00000': 'line_chart',
      // 阶梯线图
      '10000': 'step_line_chart',
      // 平滑线图
      '01000': 'smooth_line_chart',
      // 面积图
      '00100': 'area_chart',
      // 平滑面积图
      '01100': 'smooth_area_chart',
      // 堆叠面积图
      '00110': 'stacked_area_chart',
      // 平滑堆叠面积图
      '01110': 'smooth_stacked_area_chart',
      // 区域线图
      '00101': 'area_line_chart',
    };

    return (chartMap as any)?.[code] ?? 'line_chart';
  },
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 4,
        message:
          '该线图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度。已自动关闭标记点、圆滑曲线、面积图等配置项，若要关闭可加force配置项。推荐开启缩略轴slider配置，问题码#05-1',
      },
    ],
    process: processLineBigData,
  },
  extremeData: processLineExtremeData,
  children: {
    step_line_chart: {
      id: 'step_line_chart',
      name: '阶梯线图',
    },
    smooth_line_chart: {
      id: 'smooth_line_chart',
      name: '平滑线图',
    },
    area_chart: {
      id: 'area_chart',
      name: '面积图',
    },
    smooth_area_chart: {
      id: 'smooth_area_chart',
      name: '平滑面积图',
    },
    stacked_area_chart: {
      id: 'stacked_area_chart',
      name: '堆叠面积图',
    },
    smooth_stacked_area_chart: {
      id: 'smooth_stacked_area_chart',
      name: '平滑堆叠面积图',
    },
    area_line_chart: {
      id: 'area_line_chart',
      name: '区域线图',
    },
  },
  processConfig: (config: any) => {
    let finalConfig = config;

    if (finalConfig.stack) {
      finalConfig = {
        ...finalConfig,
        area: true,
      };
    }

    // 显示label时处理x轴range，避免label显示不全
    let range;
    if (finalConfig?.label && finalConfig?.label?.visible !== false) {
      range = [0.02, 0.98];
    } else if (finalConfig?.symbol) {
      range = [0.01, 0.99];
    }

    if (range) {
      finalConfig = {
        ...finalConfig,
        xAxis: finalConfig?.xAxis
          ? {
              range,
              ...(finalConfig?.xAxis || {}),
            }
          : finalConfig?.xAxis,
      };
    }

    // 线图与柱图当同时使用自定义legend与slider时，切换为默认legend
    // 临时方案，自定义legend与slider无法兼容，待修复bug后删除
    if (
      (finalConfig?.legend?.foldable ||
        finalConfig?.legend?.table ||
        finalConfig?.legend?.gradient) &&
      finalConfig?.slider
    ) {
      finalConfig = {
        ...finalConfig,
        legend: {
          ...finalConfig?.legend,
          foldable: false,
          table: false,
          gradient: false,
        },
      };
    }

    return finalConfig;
  },
  processData: (data: any, config: any) => {
    return runDataRules(data, config);
  },
};

/** 饼图 */
const pieChart: IChartRule = {
  id: 'pie_chart',
  name: '饼图',
  coord: Coordinate.Polar,
  dataStructure: DataStructure.Common,
  classify: (data: any, config: any) => {
    if (config?.cycle) {
      return 'donut_chart';
    }
    return 'pie_chart';
  },
  emptyData: EmptyDataProcess.Polar,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Polar,
        threshold: 100,
        message: '该饼图半径过小，会影响展示效果，建议加大图表半径',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 10,
        message: '该饼图分块过多，会影响可读性，推荐开启autoFormat进行数据收敛，问题码#05-3',
      },
    ],
    process: processPieBigData,
  },
  extremeData: processLPieExtremeData,
  children: {
    donut_chart: {
      id: 'donut_chart',
      name: '环图',
    },
  },
};

/** 直方图 */
const histogram: IChartRule = {
  id: 'histogram',
  name: '直方图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Common,
  classify: (data: any, config: any) => {
    // 方向，横向还是纵向
    const isColumn = config?.column === undefined || config?.column === true;

    // 是否是极坐标
    const isPolar = !!config?.polar;

    // 是否归一化
    const isNormalize = !!config?.normalize;

    // 编码
    const code = `${isColumn ? 1 : 0}${isPolar ? 1 : 0}${isNormalize ? 1 : 0}`;

    // 映射
    const chartMap = {
      // 普通直方图
      '100': 'histogram',
      // 水平直方图
      '000': 'horizontal_histogram',
      // 归一化直方图
      '101': 'normalized_histogram',
      // 极坐标直方图
      '110': 'polar_histogram',
    };

    return (chartMap as any)?.[code] ?? 'histogram';
  },
  emptyData: EmptyDataProcess.Axis,
  children: {
    horizontal_histogram: {
      id: 'horizontal_histogram',
      name: '水平直方图',
      mainAxis: 'y',
    },
    normalized_histogram: {
      id: 'normalized_histogram',
      name: '归一化直方图',
    },
    polar_histogram: {
      id: 'polar_histogram',
      name: '极坐标直方图',
      coord: Coordinate.Polar,
    },
  },
  processData: (data: any, config: any) => {
    return runDataRules(data, config);
  },
};

/** 线柱图 */
const lineBarChart: IChartRule = {
  id: 'line_bar_chart',
  name: '线柱图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Origin,
  classify: (data: any, config: any) => {
    // 判断是否是分组堆叠，此处简化处理，不判断数据
    const isDodgeStack = !!config?.dodgeStack;

    // 判断是否是堆叠图
    const isStack = !isDodgeStack && !!config?.stack;

    // 是否面积图
    const isArea = !!config?.area;

    // 编码
    const code = `${isDodgeStack ? 1 : 0}${isStack ? 1 : 0}${isArea ? 1 : 0}`;

    // 映射
    const chartMap = {
      '000': 'line_bar_chart',
      // 堆叠线柱图
      '010': 'stacked_line_bar_chart',
      // 分组堆叠线柱图
      '100': 'grouped_stacked_line_bar_chart',
      // 面积线柱图
      '001': 'area_bar_chart',
      // 堆叠面积线柱图
      '011': 'stacked_area_bar_chart',
      // 分组堆叠面积线柱图
      '101': 'grouped_stacked_area_bar_chart',
    };

    return (chartMap as any)?.[code] ?? 'line_bar_chart';
  },
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 15,
        message: '该线柱图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
    ],
  },
  children: {
    stacked_line_bar_chart: {
      id: 'stacked_line_bar_chart',
      name: '堆叠线柱图',
    },
    grouped_stacked_line_bar_chart: {
      id: 'grouped_stacked_line_bar_chart',
      name: '分组堆叠线柱图',
    },
    area_bar_chart: {
      id: 'area_bar_chart',
      name: '面积线柱图',
    },
    stacked_area_bar_chart: {
      id: 'stacked_area_bar_chart',
      name: '堆叠面积线柱图',
    },
    grouped_stacked_area_bar_chart: {
      id: 'grouped_stacked_area_bar_chart',
      name: '分组堆叠面积线柱图',
    },
  },
  processData: (data: any, config: any) => {
    return runDataRules(data, config);
  },
};

/** 线点图 */
const lineScatterChart: IChartRule = {
  id: 'line_scatter_chart',
  name: '线点图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Origin,
  classify: (data: any, config: any) => {
    if (config?.area) {
      return 'area_scatter_chart';
    }

    return 'line_scatter_chart';
  },
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 10,
        message: '该线点图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
    ],
  },
  children: {
    area_scatter_chart: {
      id: 'area_scatter_chart',
      name: '面积线点图',
    },
  },
  processConfig: (config: any) => {
    let finalConfig = config;

    // 显示label时处理x轴range，避免label显示不全
    let range;
    if (
      (finalConfig?.lineLabel && finalConfig?.lineLabel?.visible !== false) ||
      (finalConfig?.scatterLabel && finalConfig?.scatterLabel?.visible !== false)
    ) {
      range = [0.02, 0.98];
    } else {
      range = [0.01, 0.99];
    }

    if (range) {
      finalConfig = {
        ...finalConfig,
        xAxis: finalConfig?.xAxis
          ? {
              range,
              ...(finalConfig?.xAxis || {}),
            }
          : finalConfig?.xAxis,
      };
    }

    return finalConfig;
  },
  processData: (data: any, config: any) => {
    return runDataRules(data, config);
  },
};

/** 散点图 */
// todo: 散点图数据量计算方式及大数据判断调整
const scatterChart: IChartRule = {
  id: 'scatter_chart',
  name: '散点图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Common,
  classify: (data: any, config: any) => {
    if (config?.jitter) {
      return 'jitter_scatter_chart';
    }
    return 'scatter_chart';
  },
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 2,
        message: '该散点图数据过于密集，会影响展示效果，建议减少数据量或加大图表尺寸',
      },
    ],
  },
  children: {
    jitter_scatter_chart: {
      id: 'jitter_scatter_chart',
      name: '扰动点图',
    },
  },
  processConfig: (config: any) => {
    let finalConfig = config;

    // 显示label时处理x轴range，避免label显示不全
    let range;
    if (!finalConfig.jitter) {
      if (finalConfig?.label && finalConfig?.label?.visible !== false) {
        range = [0.02, 0.98];
      } else {
        range = [0.01, 0.99];
      }
    }

    if (range) {
      finalConfig = {
        ...finalConfig,
        xAxis: finalConfig?.xAxis
          ? {
              range,
              ...(finalConfig?.xAxis || {}),
            }
          : finalConfig?.xAxis,
      };
    }

    return finalConfig;
  },
  processData: (data: any, config: any) => {
    return runDataRules(data, config);
  },
};

/** 玫瑰图 */
const nightingaleRoseChart: IChartRule = {
  id: 'nightingale_rose_chart',
  name: '南丁格尔玫瑰图',
  coord: Coordinate.Polar,
  dataStructure: DataStructure.Common,
  classify: (data: any, config: any) => {
    if (config?.cycle) {
      return 'nightingale_rose_donut_chart';
    }
    return 'nightingale_rose_chart';
  },
  emptyData: EmptyDataProcess.Polar,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Polar,
        threshold: 100,
        message: '该玫瑰图半径过小，会影响展示效果，建议加大图表半径',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 15,
        message: '该玫瑰图分块过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  children: {
    nightingale_rose_donut_chart: {
      id: 'nightingale_rose_donut_chart',
      name: '玫瑰环图',
    },
  },
};

/** 雷达图 */
const radarChart: IChartRule = {
  id: 'radar_chart',
  name: '雷达图',
  coord: Coordinate.Polar,
  dataStructure: DataStructure.Common,
  classify: (data: any, config: any) => {
    if (config?.area) {
      return 'radar_area_chart';
    }
    return 'radar_chart';
  },
  emptyData: EmptyDataProcess.Polar,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Polar,
        threshold: 100,
        message: '该雷达图数据过于密集，会影响展示效果，建议减少数据量或加大图表半径',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 30,
        message: '该雷达图分块过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  children: {
    radar_area_chart: {
      id: 'radar_area_chart',
      name: '雷达面积图',
    },
  },
};

/** 漏斗图 */
const funnelChart: IChartRule = {
  id: 'funnel_chart',
  name: '漏斗图',
  coord: Coordinate.Cartesian,
  mainAxis: 'y',
  dataStructure: DataStructure.Common,
  classify: (data: any, config: any) => {
    // 方向
    const isColumn = !config?.direction || config?.direction === 'vertical';

    // 是否尖顶
    const isPyramid = !!config?.pyramid;

    // 编码
    const code = `${isColumn ? 1 : 0}${isPyramid ? 1 : 0}`;

    // 映射
    const chartMap = {
      // 普通漏斗图
      '10': 'funnel_chart',
      // 水平漏斗图
      '00': 'horizontal_funnel_chart',
      // 尖顶漏斗图
      '11': 'pyramid_funnel_chart',
      // 水平尖顶漏斗图
      '01': 'horizontal_pyramid_funnel_chart',
    };

    return (chartMap as any)?.[code] ?? 'funnel_chart';
  },
  emptyData: EmptyDataProcess.Background,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 30,
        message: '该漏斗图数据过于密集，会影响展示效果，建议减少数据量或加大图表尺寸',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 10,
        message: '该漏斗图数据量过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  children: {
    horizontal_funnel_chart: {
      id: 'horizontal_funnel_chart',
      name: '水平漏斗图',
      mainAxis: 'x',
    },
    pyramid_funnel_chart: {
      id: 'pyramid_funnel_chart',
      name: '尖顶漏斗图',
    },
    horizontal_pyramid_funnel_chart: {
      id: 'horizontal_pyramid_funnel_chart',
      name: '水平尖顶漏斗图',
      mainAxis: 'x',
    },
  },
};

/** 多重饼图 */
const multiPieChart: IChartRule = {
  id: 'multi_pie_chart',
  name: '多重饼图',
  coord: Coordinate.Polar,
  dataStructure: DataStructure.Tree,
  classify: (data: any, config: any) => {
    if (config?.cycle) {
      return 'multi_donut_chart';
    }
    return 'multi_pie_chart';
  },
  emptyData: EmptyDataProcess.Polar,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Polar,
        threshold: 100,
        message: '该多重饼图数据过于密集，会影响展示效果，建议加大图表半径',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 20,
        message: '该多重饼图分块过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
  children: {
    multi_donut_chart: {
      id: 'multi_donut_chart',
      name: '多重环图',
    },
  },
};

/** 矩形树图 */
const treemap: IChartRule = {
  id: 'treemap',
  name: '矩形树图',
  coord: Coordinate.Cartesian,
  dataStructure: DataStructure.Tree,
  classify: (data: any, config: any) => {
    if (config?.polar) {
      return 'polar_treemap';
    }
    return 'treemap';
  },
  emptyData: EmptyDataProcess.Background,
  children: {
    polar_treemap: {
      id: 'polar_treemap',
      name: '极坐标树图',
      coord: Coordinate.Polar,
    },
  },
};

/** 相邻层次图 */
const hierarchyChart: IChartRule = {
  id: 'hierarchy_chart',
  name: '相邻层次图',
  coord: Coordinate.Cartesian,
  dataStructure: DataStructure.Tree,
  classify: (data: any, config: any) => {
    if (config?.polar) {
      return 'polar_hierarchy_chart';
    }
    return 'hierarchy_chart';
  },
  emptyData: EmptyDataProcess.Background,
  children: {
    polar_hierarchy_chart: {
      id: 'polar_hierarchy_chart',
      name: '旭日图',
      coord: Coordinate.Polar,
    },
  },
};

/** 箱型图 */
const boxChart: IChartRule = {
  id: 'box_chart',
  name: '箱型图',
  coord: Coordinate.Cartesian,
  dataStructure: DataStructure.Common,
  mainAxis: 'x',
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 50,
        message: '该箱型图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 20,
        message: '该箱型图数据量过多，不利于数据间的比较，建议减少数据量或改用其他图表',
      },
    ],
  },
};

/** 烛形图 */
const candlestickChart: IChartRule = {
  id: 'candlestick_chart',
  name: '烛形图',
  coord: Coordinate.Cartesian,
  dataStructure: DataStructure.Common,
  mainAxis: 'x',
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 8,
        message: '该烛形图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 100,
        message: '该烛形图数据量过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
};

/** 多重圆环 */
const multiCircle: IChartRule = {
  id: 'multi_circle',
  name: '多重圆环',
  coord: Coordinate.Polar,
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Polar,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Polar,
        threshold: 100,
        message: '该多重圆环图半径过小，会影响展示效果，建议加大图表半径',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 10,
        message: '该多重圆环数据过多，会影响可读性，建议减少数据量或改用其他图表',
      },
    ],
  },
};

/** 热力图 */
const heatmap: IChartRule = {
  id: 'heatmap',
  name: '热力图',
  coord: Coordinate.Cartesian,
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Background,
};

/** 箱型线图 */
const lineBoxChart: IChartRule = {
  id: 'line_box_chart',
  name: '箱型线图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Origin,
  emptyData: EmptyDataProcess.Axis,
  bigData: {
    judgements: [
      {
        type: BigDataJudgement.Length,
        threshold: 50,
        message: '该箱型线图数据过于密集，会影响展示效果，建议减少数据量或加大图表宽度',
      },
      {
        type: BigDataJudgement.Number,
        threshold: 20,
        message: '该箱型线图数据量过多，不利于数据间的比较，建议减少数据量或改用其他图表',
      },
    ],
  },
};

/** 分箱图 */
const rectangleChart: IChartRule = {
  id: 'rectangle_chart',
  name: '矩形分箱图',
  coord: Coordinate.Cartesian,
  mainAxis: 'x',
  dataStructure: DataStructure.Common,
  emptyData: EmptyDataProcess.Background,
};

/** 桑基图 */
const sankeyChart: IChartRule = {
  id: 'sankey_chart',
  name: '桑基图',
  coord: Coordinate.Cartesian,
  dataStructure: DataStructure.Graph,
  emptyData: EmptyDataProcess.Background,
};

export default {
  G2Bar: barChart,
  G2Line: lineChart,
  G2Pie: pieChart,
  G2Histogram: histogram,
  G2LineBar: lineBarChart,
  G2LineScatter: lineScatterChart,
  G2Scatter: scatterChart,
  G2Nightingale: nightingaleRoseChart,
  G2Radar: radarChart,
  G2Funnel: funnelChart,
  G2MultiPie: multiPieChart,
  G2Treemap: treemap,
  G2Hierarchy: hierarchyChart,
  G2Box: boxChart,
  G2Wcandlestick: candlestickChart,
  G2MultiCircle: multiCircle,
  G2Heatmap: heatmap,
  G2Linebox: lineBoxChart,
  G2Rectangle: rectangleChart,
  G2Sankey: sankeyChart,
};
