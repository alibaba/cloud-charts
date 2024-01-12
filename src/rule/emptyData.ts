import { DataStructure } from './data';
import themes from '../themes/index';

/** 空数据处理的三种类型 */
export enum EmptyDataProcess {
  // 笛卡尔坐标系中，显示坐标轴
  Axis,
  // 极坐标系中，显示圆形
  Polar,
  // 显示灰色背景
  Background,
}

/** 根据数据量判断是否是空数据 */
export function isEmptyData(dataSize: number) {
  return dataSize === 0;
}

/** 根据空数据处理类型、数据结构类型进行空数据处理，个别图表需要特殊处理 */
export function processEmptyData(emptyType: EmptyDataProcess, dataType: DataStructure, chartName: string) {
  if (emptyType === EmptyDataProcess.Axis) {
    return {
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
    };
  } else if (emptyType === EmptyDataProcess.Polar) {
    if (chartName === 'G2Radar') {
      // 雷达图特殊处理
      return {
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
      };
    } else if (dataType === DataStructure.Common) {
      return {
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
      };
    } else if (dataType === DataStructure.Tree) {
      return {
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
          tooltip: false,
          colors: themes['widgets-color-layout-background'],
          label: false,
        },
      };
    }
  } else {
    if (dataType === DataStructure.Common) {
      // 分箱图特殊处理
      if (chartName === 'G2Rectangle') {
        return {
          data: [{ x: 0, y: 0 }],
          config: {
            padding: 0,
            xAxis: false,
            yAxis: false,
            tooltip: false,
            legend: false,
          },
        };
      }
      return {
        data: [],
        config: {
          padding: 0,
          xAxis: false,
          yAxis: false,
          tooltip: false,
          legend: false,
        },
      };
    } else if (dataType === DataStructure.Tree) {
      return {
        data: {
          name: '',
          children: [],
        },
        config: {
          padding: 0,
          xAxis: false,
          yAxis: false,
          tooltip: false,
          legend: false,
          colors: themes['widgets-color-layout-background'],
        },
      };
    } else if (dataType === DataStructure.Graph) {
      return {
        data: {
          nodes: [],
          links: [],
        },
        config: {
          padding: 0,
          xAxis: false,
          yAxis: false,
          tooltip: false,
          legend: false,
        },
      };
    }
  }

  return {
    data: null,
    config: null,
  };
}
