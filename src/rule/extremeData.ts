import { warn } from '../common/log';
import themes from '../themes';

/** 柱图极端数据处理 */
export function processBarExtremeData(chartObj: any, config: any, data: any) {
  const { dataSize, size } = chartObj;
  const width = size[0];
  const { force } = chartObj.props;
  const chartName = chartObj?.chartRule?.name;

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
      warn(chartName, '当前柱图数据量较少，推荐关闭force配置项开启极端数据自适应。问题码#08');
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
        !(colors.length === 12 && themes.category_12?.every((val, index) => val === colors?.[index])) &&
        !(colors.length === 20 && themes.category_20?.every((val, index) => val === colors?.[index]))
      ) {
        colors = [...colors, ...(themes.category_20?.slice(colors.length, dataTypes.length) || [])];
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
      const filteredData = data.filter((item: any) => item.x === lastX && item.dodge === lastDodge);
      lastY = filteredData[filteredData.length - 1].y;
    } else {
      const filteredData = data.filter((item: any) => item.x === lastX);
      lastY = filteredData[filteredData.length - 1].y;
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
        warn(chartName, '当前数据量较少，已默认开启左对齐，推荐通过extreme配置项开启占位补全。问题码#08');
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
        warn(chartName, '当前数据量较少，已默认开启左对齐与占位补全，可通过extreme配置项进行关闭。问题码#08');
      }
      // 无特殊处理
      else {
        warn(chartName, '当前数据量较少，推荐通过extreme配置项开启左对齐与占位补全。问题码#08');
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
        warn(chartName, '当前数据量较少，已默认开启左对齐，推荐通过extreme配置项开启占位补全。问题码#08');
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
        warn(chartName, '当前数据量较少，已默认开启左对齐与占位补全，可通过extreme配置项进行关闭。问题码#08');
      }
      // 无特殊处理
      else {
        warn(chartName, '当前数据量较少，推荐通过extreme配置项开启左对齐与占位补全。问题码#08');
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
              legend:
                config?.legend === false || config?.legend?.visible === false
                  ? false
                  : {
                      items: dataTypes.map((t: any, index: number) => ({
                        name: t,
                        value: t,
                        marker: {
                          symbol: 'square',
                          style: {
                            fill: Array.isArray(newColors) ? newColors[index] : newColors(t),
                          },
                        },
                      })),
                      ...(config?.legend || {}),
                    },
              xAxis:
                config?.xAxis === false || config?.xAxis?.visible === false
                  ? false
                  : {
                      ...xAxis,
                      autoHide: false,
                      autoEllipsis: true,
                      ...(config?.xAxis || {}),
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

  return {
    isExtreme: false,
  };
}

/** 线图极端数据处理 */
export function processLineExtremeData(chartObj: any, config: any, data: any) {
  // 此处需要所有数据点的个数，不能直接用dataSize
  // const { dataSize } = chartObj;
  const dataSize = data?.length || 0;
  const chartName = chartObj?.chartRule?.name;

  // 计算线的数量
  const lineCount = Array.from(new Set(data.map((d: any) => d.type))).length;
  let isEqual = false;
  if (lineCount === 1) {
    let temp = data?.[0]?.y;
    const filterArr = data?.filter((el: any) => el?.y !== temp);
    if (!filterArr?.[length] && temp !== null && temp !== undefined) {
      isEqual = true;
    }
  }

  // 只有一个点的时候，在Y轴中间，并开启label与symbol
  if (lineCount === 1 && dataSize === 1) {
    warn(chartName, '当前线图数据较少，为优化展示，已自动开启标记和文本。');
    return {
      config: {
        yAxis: {
          ...config.yAxis,
          min: data?.[0]?.y > 0 ? 0 : data?.[0]?.y * 2,
          max: data?.[0]?.y > 0 ? data?.[0]?.y * 2 : 0,
        },
        // label判断自定义
        label: {
          ...(typeof config?.label === 'object' ? config?.label : {}),
          visible: true,
        },
        symbol: {
          ...(typeof config?.symbol === 'object' ? config?.symbol : {}),
          visible: true,
        },
      },
      isExtreme: true,
    };
  } else if (dataSize === lineCount) {
    // 多条线，每条线一个点时，开启symbol,label暂不开启
    warn(chartName, '当前线图数据较少，为优化展示，已自动开启标记。');
    return {
      config: {
        // label: {
        //   ...(typeof config?.label === 'object' ? config?.label : {}),
        //   visible: true,
        // },
        symbol: {
          ...(typeof config?.symbol === 'object' ? config?.symbol : {}),
          visible: true,
        },
      },
      isExtreme: true,
    };
  } else if (lineCount === 1 && dataSize === 2) {
    // 一条线两个点，开启area、symbol和label
    warn(chartName, '当前线图数据较少，为优化展示，已自动开启面积、标记、文本。');
    return {
      config: {
        // label判断自定义
        label: {
          ...(typeof config?.label === 'object' ? config?.label : {}),
          visible: true,
        },
        symbol: {
          ...(typeof config?.symbol === 'object' ? config?.symbol : {}),
          visible: true,
        },
        area: true,
      },
      isExtreme: true,
    };
  } else if (lineCount === 1 && isEqual) {
    return {
      config: {
        yAxis: {
          ...config.yAxis,
          min: data?.[0]?.y > 0 ? 0 : data?.[0]?.y * 2,
          max: data?.[0]?.y > 0 ? data?.[0]?.y * 2 : 0,
          tickCount: 3,
        },
      },
      isExtreme: true,
    };
  } else if (lineCount > 3 && !config.stack && config.area) {
    // 当补开启堆叠面积图的时候，且分组数量大于3组
    warn(chartName, '当前线图组数超过3组，不适合开启面积图，已自动关闭面积图配置');
    return {
      config: {
        area: false,
      },
      isExtreme: true,
    };
  }

  return {
    isExtreme: false,
  };
}
