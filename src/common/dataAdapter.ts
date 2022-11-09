'use strict';
import { Types, BaseChartConfig } from './types';

export interface DataAdapterConfig extends BaseChartConfig {
  xAxis?: {
    categories?: number[] | string[];
  };
  yAxis?: Types.LooseObject | any[];
}

type RawDataItem = (number | string)[] | Types.LooseObject;
export interface DataAdapterData {
  name: string;
  data?: RawDataItem[];
  yAxis?: number;
  dodge?: string;
  facet?: string;
  visible?: boolean;
  type?: string;
}

interface dataFields {
  x?: string;
  y?: string;
  type?: string;
}

/**
 * drawLine 绘制线图逻辑
 *
 * @param {DataAdapterData|DataAdapterData[]} data 原始数据
 * @param {DataAdapterConfig} config 配置项
 * @param {dataFields} dataFields 数据字段映射规则
 *
 * @return {Array} json-array 型数据
 * */
export default function highchartsDataToG2Data(
  data: DataAdapterData | DataAdapterData[],
  config: DataAdapterConfig,
  dataFields?: dataFields,
) {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  const { /*x: xField = 'x', y: yField = 'y',*/ type: typeField = 'type' } = dataFields || {};
  const newData: Types.LooseObject[] = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach((oneData, index) => {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      const { name: dataName, yAxis: yIndex = 0, dodge, visible, ...groupExtra } = oneData;

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra,
            groupExtra,
            dodge,
            visible,
            [typeField]: dataName || `undefined-name-${index}`,
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = typeof d === 'number' ? d : d[0];
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra: [],
            groupExtra,
            dodge,
            visible,
            [typeField]: dataName || `undefined-name-${index}`,
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra,
            groupExtra,
            dodge,
            visible,
            [typeField]: dataName || `undefined-name-${index}`,
          });
        }
      });
    });
  } else {
    data.forEach((oneData, index) => {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      const { name: dataName, facet, dodge, visible, ...groupExtra } = oneData;

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            y,
            extra,
            groupExtra,
            facet,
            dodge,
            visible,
            [typeField]: dataName || `undefined-name-${index}`,
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = typeof d === 'number' ? d : d[0];
          newData.push({
            x,
            y,
            extra: [],
            groupExtra,
            facet,
            dodge,
            visible,
            [typeField]: dataName || `undefined-name-${index}`,
          });
        } else if (typeof d === 'number') {
          newData.push({
            x: d,
            y: d,
            groupExtra,
            visible,
            [typeField]: dataName || `undefined-name-${index}`,
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            y,
            extra,
            groupExtra,
            facet,
            dodge,
            visible,
            [typeField]: dataName || `undefined-name-${index}`,
          });
        }
      });
    });
  }

  return newData;
}
