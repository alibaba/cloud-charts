import getEmptyDataType, { EmptyJudgeType } from './emptyDataType';
import { ExceedJudgeType } from './bigDataType';
import themes from '../themes';
import { warn } from './log';
import { FullCrossName } from '../constants';
import { postMessage } from './postMessage';
import test from './test';

// 空数据检测
export function checkEmptyData(data: any, chartType: string) {
  const type = (getEmptyDataType() as any)[chartType]?.emptyJudge;
  if (type === EmptyJudgeType.COMMON) {
    return (
      !data ||
      (Array.isArray(data) && data?.length === 0) ||
      (Array.isArray(data) && data?.every((item: any) => !item?.data || item?.data?.length === 0)) ||
      Object.keys(data)?.length === 0
    );
  }
  if (type === EmptyJudgeType.CHILDREN) {
    return !data || !data?.children || data?.children?.length === 0;
  }
  if (type === EmptyJudgeType.ARRAY) {
    return !data || data?.length === 0;
  }
  if (type === EmptyJudgeType.GRAPH) {
    return !data || !data?.nodes || data?.nodes?.length === 0 || !data?.links || data?.links?.length === 0;
  }

  return false;
}

// 大数据检测
export function checkBigData(
  chartName: string,
  config: any,
  judgements: any,
  dataSize: number,
  width: number,
  height: number,
) {
  if (!dataSize || dataSize === 0 || !width || !height) {
    return false;
  }

  let res = false;
  judgements?.forEach((judgement: any) => {
    const { type, threshold, message } = judgement;
    let isExceed = false;
    if (type === ExceedJudgeType.LEGNTH) {
      const isHorizontal =
        judgement?.directionConfig === 'column'
          ? config?.column !== undefined && (!config?.column || typeof config?.column === 'object')
          : judgement?.directionConfig === 'direction'
          ? config?.direction !== 'horizontal'
          : false;
      const length = isHorizontal ? height ?? 0 : width ?? 0;
      isExceed = length > 0 && length / dataSize < threshold;
    } else if (type === ExceedJudgeType.AREA) {
      isExceed = (height * width) / dataSize < threshold;
    } else if (type === ExceedJudgeType.NUMBER) {
      isExceed = dataSize > threshold;
    }
    /*
    else if (type === ExceedJudgeType.POLAR) {
      const radius = Math.min(this.chart?.coordinateBBox?.height, this.chart?.coordinateBBox?.width);
      isExceed = radius < threshold;
    }
    */

    if (isExceed) {
      warn(chartName.slice(2, chartName.length), message);
      res = true;
    }
  });
  return res;
}

// 极端数据检测
export function checkExtremeData(
  data: any,
  chartName: string,
  config: any,
  width: number,
  height: number,
  dataSize: number,
  force: any,
): {
  isExtreme: boolean;
  data?: any;
  config?: any;
} {
  if (!dataSize || dataSize === 0 || !width || !height) {
    return {
      isExtreme: false,
    };
  }

  // 柱图
  // 检测数据量过少，极坐标与横着的情况不处理，分面也不处理
  // 暂时单独写，待统一
  if (
    chartName === 'G2Bar' &&
    config?.polar !== true &&
    (config?.column === undefined || config?.column === true) &&
    !config?.facet
  ) {
    // 图表宽度，50是估算的padding
    const length = width - 50;

    // 根据stack、dodgeStack等配置项计算一组柱子的宽度，从而计算至少需要几组柱子
    const barWidth = 24;
    const types = Array.from(new Set(data?.map((item: any) => item?.type)))?.length ?? 0;
    const dodges = Array.from(new Set(data?.map((item: any) => item?.dodge)))?.length ?? 1;
    const groups = config?.dodgeStack ? dodges : config?.stack ? 1 : types;
    const minCount = Math.floor(length / (groups * barWidth + 80));

    if (dataSize < minCount) {
      if (force === true || force?.extreme === true) {
        warn('Bar', '当前数据量较少，推荐关闭force配置项开启极端数据自适应。问题码#08');
        return {
          isExtreme: true,
        };
      }
      // x轴类型
      const axisType = config?.xAxis?.type ?? 'cat';

      // 原数据中类型
      const dataTypes = Array.from(new Set(data.map((x: any) => x.type)));

      // 颜色
      let colors = config?.colors ?? themes.category_20;
      if (Array.isArray(colors) && colors.length < dataTypes.length) {
        if (
          !(colors.length === 12 && themes.category_12.every((val, index) => val === colors?.[index])) &&
          !(colors.length === 20 && themes.category_20.every((val, index) => val === colors?.[index]))
        ) {
          colors = [...colors, ...themes.category_20.slice(colors.length, dataTypes.length)];
        }
        while (colors.length < dataTypes.length) {
          colors = [...colors, ...colors.slice(0, dataTypes.length - colors.length)];
        }
      }

      const newData = [...data];
      let newColors = colors;
      let xAxis = {};
      const { extreme } = force ?? {};
      let needColor = false;

      let alignLeft = false;
      let showPlaceholder = false;

      // 计算最后一个柱子的y值
      const xValues = Array.from(new Set(data.map((item: any) => item.x)));
      const lastX = xValues[xValues.length - 1];
      const dodges = Array.from(new Set(data.map((item: any) => item.dodge)));
      const lastDodge = dodges[dodges.length - 1];
      let lastY = 0;
      if (config.dodgeStack && lastDodge) {
        lastY = data
          .filter((item: any) => item.x === lastX && item.dodge === lastDodge)
          .map((item: any) => item.y || 0)
          .reduce((pre: number, cur: number) => pre + cur);
      } else if (config.stack) {
        lastY = data
          .filter((item: any) => item.x === lastX)
          .map((item: any) => item.y || 0)
          .reduce((pre: number, cur: number) => pre + cur);
      } else if (config.dodge && lastDodge) {
        lastY = data.findLast((item: any) => item.x === lastX && item.dodge === lastDodge).y;
      } else {
        lastY = data.findLast((item: any) => item.x === lastX).y;
      }

      // 分类数据
      if (axisType === 'cat') {
        // 分类数据默认隐藏占位

        // 是否左对齐
        // 优先级： 用户配置>特殊情况（数据量为1）>默认配置
        /*
        alignLeft =
          force === false || extreme === false || extreme?.alignLeft === false
            ? true
            : extreme === true || extreme?.alignLeft === true
            ? false
            : dataSize === 1;
            */
        alignLeft = force === false || extreme === false || extreme?.alignLeft === false;

        // 是否显示占位
        // 优先级：用户配置>默认配置
        showPlaceholder = force === false || extreme === false || extreme?.showPlaceholder === false;

        // 左对齐，无占位
        if (alignLeft && !showPlaceholder) {
          const values = Array.from(new Set(data.map((item: any) => item.x)));
          for (let i = 0; i < minCount - dataSize; i += 1) {
            values.push(`widgets-pad-${i}`);
          }
          xAxis = { values };
          warn('Bar', '当前数据量较少，已默认开启左对齐，推荐通过extreme配置项开启占位补全。问题码#08');
        }
        // 左对齐且显示占位
        else if (alignLeft && showPlaceholder) {
          for (let i = 0; i < minCount - dataSize; i += 1) {
            newData.push({
              x: `widgets-pad-${i}`,
              y: lastY,
              type: 'widgets-pad-type',
            });
          }
          needColor = true;
          warn('Bar', '当前数据量较少，已默认开启左对齐与占位补全，可通过extreme配置项进行关闭。问题码#08');
        }
        // 无特殊处理
        else {
          warn('Bar', '当前数据量较少，推荐通过extreme配置项开启左对齐与占位补全。问题码#08');
        }
      }
      // 时间分类数据
      else if (axisType === 'timeCat') {
        // 计算最后一个柱子的y值
        /*
        let lastY = data?.[0]?.y ?? 0;
        let curMax = data?.[0]?.x ?? 0;
        data.forEach((item: any) => {
          if (item.x > curMax) {
            curMax = item.x;
            lastY = item.y;
          }
        });
        */

        // 时间分类数据默认开启

        // 是否左对齐
        // 优先级： 用户配置>默认配置
        //alignLeft = !(extreme === true || extreme?.alignLeft === true);
        alignLeft = force === false || extreme === false || extreme?.alignLeft === false;

        // 是否显示占位
        // 优先级：用户配置>默认配置
        showPlaceholder = !(extreme === true || extreme?.showPlaceholder === true);

        const values = Array.from(new Set(data.map((item: any) => item.x)));
        const minX = Math.min(...(values as number[]));
        const maxX = Math.max(...(values as number[]));
        const step = maxX !== minX ? Math.floor((maxX - minX) / dataSize) : 100;

        // 左对齐，无占位
        if (alignLeft && !showPlaceholder) {
          const newValues = [...values];
          for (let i = 0; i < minCount - dataSize; i += 1) {
            newValues.push(maxX + step * (i + 1));
          }
          xAxis = { values: newValues, ticks: values };
          warn('Bar', '当前数据量较少，已默认开启左对齐，推荐通过extreme配置项开启占位补全。问题码#08');
        }
        // 左对齐且显示占位
        else if (alignLeft && showPlaceholder) {
          for (let i = 0; i < minCount - dataSize; i += 1) {
            newData.push({
              x: maxX + step * (i + 1),
              y: lastY,
              type: 'widgets-pad-type',
            });
          }
          xAxis = {
            ticks: values,
          };
          needColor = true;
          warn('Bar', '当前数据量较少，已默认开启左对齐与占位补全，可通过extreme配置项进行关闭。问题码#08');
        }
        // 无特殊处理
        else {
          warn('Bar', '当前数据量较少，推荐通过extreme配置项开启左对齐与占位补全。问题码#08');
        }
      }

      if (needColor) {
        // 颜色处理
        if (Array.isArray(colors)) {
          newColors = [...colors.slice(0, dataTypes.length), themes['widgets-color-container-background']];
        } else if (typeof colors === 'string') {
          newColors = [...dataTypes.map(() => colors), themes['widgets-color-container-background']];
        } else if (typeof colors === 'function') {
          newColors = (type: string) => {
            if (type === 'widgets-pad-type') {
              return themes['widgets-color-container-background'];
            } else {
              return colors(type);
            }
          };
        }
      }

      return {
        isExtreme: true,
        data: newData,
        config: {
          ...(alignLeft
            ? {
                legend: {
                  items: dataTypes.map((t: string, index: number) => ({
                    name: t,
                    value: t,
                    marker: {
                      symbol: 'square',
                      style: {
                        fill: Array.isArray(newColors) ? newColors[index] : newColors(t),
                      },
                    },
                  })),
                },
                xAxis: {
                  ...xAxis,
                  autoHide: false,
                  autoEllipsis: true,
                },
              }
            : {}),
          ...(alignLeft && showPlaceholder
            ? {
                colors: newColors,
                tooltip: false,
              }
            : {}),
        },
      };
    }
  }
  // 线图
  else if (chartName === 'G2Line') {
    // 计算最大最小值，优化只有一个点的时候的Y轴刻度
    let min = data?.[0]?.y;
    let max = data?.[0]?.y;
    const typeSet: any = [];
    data?.forEach((el: any) => {
      if (el?.visible || el?.type?.includes('undefined') || el?.visible === undefined) {
        typeSet.push(el?.type);
        min = el.y < min ? el.y : min;
        max = el.y > max ? el.y : max;
      }
    });

    const extremeConfig: any = {
      area: true,
      symbol: true,
      label: true,
    };

    if (new Set(typeSet)?.size < 2 && dataSize < 6 && dataSize > 0) {
      warn('Line', '当前线图数据较少，为优化展示，已自动开启面积、标记、文本。');
      return {
        config: extremeConfig,
        isExtreme: true,
      };
    }
  }

  return {
    isExtreme: false,
  };
}

// 颜色检测
// 目标是检测config里面所有的颜色配置，这里暂时判断color/areaColors
export function checkColor(config: any, chartType: string, chart: any) {
  const filterColors: string[] = [];
  const themeString = JSON.stringify(themes).toUpperCase();
  Object.keys(config).forEach((sub: string) => {
    if (sub.toUpperCase().includes('COLOR') && Array.isArray(config[sub])) {
      config[sub].forEach((color: string) => {
        if (!themeString.includes(color.toUpperCase())) {
          filterColors.push(color);
        }
      });
    }
  });
  if (filterColors.length > 0) {
    warn('Colors', `检测出不符合主题色彩的色值：${filterColors.join(',')}，建议删除。问题码#03`);

    // Teamix.test测试用
    const errorInfo: any = {};
    const nodeMap: any = {};
    const chartClass = `${FullCrossName} ${chartType}`;
    errorInfo[chart?.ele?.id] = {
      value: filterColors,
    };
    nodeMap[chart?.ele?.id] = {
      tagName: 'div',
      className: chartClass,
      selector: `#${chart.ele.id}`,
    };
    postMessage({
      nodeMap,
      designInfo: [
        {
          checkItem: 'COLOR',
          title: '颜色应和主题保持一致',
          result: [
            {
              key: 'colors',
              weight: 10,
              description: `检测出不符合主题色彩的色值：${filterColors.join(',')}，建议删除。`,
              errorInfo,
              errorNumber: filterColors?.length,
            },
          ],
        },
      ],
    });
  }
}

// 间距检测
// 目标是检测config里面所有自定义的间距配置
export function checkPadding(config: any, chartName: string, chart: any) {
  const filterComps = ['G2Map', 'G2MiniLine', 'Wlinescatter', 'Wscatter'];
  // 增加需要过滤的组件 && 配置项
  if (
    config.hasOwnProperty('padding') &&
    config.padding &&
    !filterComps.includes(chartName) &&
    (!config.facet || !config.column)
  ) {
    const checkPaddingValue = config.padding === 0 || config.padding === 'auto';
    if (!checkPaddingValue) {
      warn('Padding', `检测出额外配置了图表间距padding: [${config.padding}]，建议删除。问题码#04`);

      // Teamix.test测试用
      const errorInfo: any = {};
      const nodeMap: any = {};
      const chartClass = `${FullCrossName} ${chartName}`;
      errorInfo[chart?.ele?.id] = {
        value: config.padding,
      };
      nodeMap[chart?.ele?.id] = {
        tagName: 'div',
        className: chartClass,
        selector: `#${chart.ele.id}`,
      };
      postMessage({
        nodeMap,
        designInfo: [
          {
            checkItem: 'PADDING',
            title: '图表不需要内设间距',
            result: [
              {
                key: 'padding',
                weight: 10,
                description: `检测出额外配置了图表间距padding: [${config.padding}]。`,
                errorInfo,
                errorNumber: 1,
              },
            ],
          },
        ],
      });
    }
  }
}

// 图形尺寸检测
// 检测config中自定义的图形尺寸
// 目前仅检测散点图的size
export function checkSizeConfig(chartType: string, config: any) {
  if (chartType === 'G2Scatter') {
    const { size = [4, 20] } = config;
    if ((Array.isArray(size) && size[0] < 4) || (typeof size === 'number' && size < 4)) {
      warn('Scatter', '检测出散点图配置项中size过小，建议不小于4，否则会影响图表的展示效果');
    }
    if ((Array.isArray(size) && size[1] > 20) || (typeof size === 'number' && size > 4)) {
      warn('Scatter', '检测出散点图配置项中size过大，建议不大于20，否则会影响图表的展示效果');
    }
  }
}

// 图形尺寸与间距检测（后置）
// 暂时只检测柱状图的柱宽与间距
export function checkSize(chartType: string, chart: any) {
  if (chartType === 'G2Bar') {
    if (chart?.coordinateInstance?.isPolar) {
      // 极坐标柱状图不检测
      return;
    }
    const isHorizontal = chart?.coordinateInstance?.isTransposed || false;

    // 检查柱宽
    const length = isHorizontal ? chart?.coordinateInstance?.height : chart?.coordinateInstance?.width;
    const rectWidth = Math.round(chart?.geometries?.[0]?.defaultSize * length);
    if (rectWidth > 24) {
      warn('Bar', '检测出柱图的柱宽过大，建议减小柱宽，不宜超过24');
    }
    // 检查柱子之间的间距
    const data = chart?.geometries?.[0]?.dataArray?.[0];
    if (!data || data.length <= 1) {
      return;
    }
    const delta = Math.abs(data?.[1]?.points?.[0]?.x - data?.[0]?.points?.[2]?.x);
    const rectMargin = Math.round(
      (isHorizontal ? chart?.coordinateInstance?.height : chart?.coordinateInstance?.width) * delta,
    );
    if (rectMargin < 4) {
      warn('Bar', '检测出柱图中柱子之间的间距过小，建议通过减少数量量或设置配置项来加大间距，不宜小于4');
    }
  }
}
