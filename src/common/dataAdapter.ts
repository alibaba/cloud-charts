'use strict';
import { Types, BaseChartConfig } from "./types";

interface DataAdapterConfig extends BaseChartConfig{
  xAxis?: {
    categories?: number[];
  };
  yAxis?: Types.LooseObject | any[];
}

type RawDataItem = (number | string)[] | Types.LooseObject;
interface DataAdapterData {
  name: string;
  data?: RawDataItem[];
  yAxis?: number;
  dodge?: string;
  facet?: string;
  visible?: boolean;
}

/**
 * drawLine 绘制线图逻辑
 *
 * @param {Object|Array} data 原始数据
 * @param {Object} config 配置项
 *
 * @return {Array} json-array 型数据
 * */
export default function highchartsDataToG2Data(data: DataAdapterData[], config: DataAdapterConfig) {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  const newData: Types.LooseObject[] = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach(oneData => {
      if (!oneData || !Array.isArray(oneData.data)) {
        return;
      }

      const {
        name: dataName,
        yAxis: yIndex = 0,
        dodge,
        visible,
        ...groupExtra
      } = oneData;

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
            type: dataName,
          });
        } else if (
          config.xAxis &&
          config.xAxis.categories &&
          config.xAxis.categories[i]
        ) {
          const x = config.xAxis.categories[i];
          const y = typeof d === 'number' ? d : d[0];
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra: [],
            groupExtra,
            dodge,
            visible,
            type: dataName,
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
            type: dataName,
          });
        }
      });
    });
  } else {
    data.forEach(oneData => {
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
            type: dataName,
          });
        } else if (
          config.xAxis &&
          config.xAxis.categories &&
          config.xAxis.categories[i]
        ) {
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
            type: dataName,
          });
        } else if (typeof d === 'number') {
          newData.push({
            x: d,
            y: d,
            groupExtra,
            visible,
            type: dataName,
          })
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
            type: dataName,
          });
        }
      });
    });
  }

  return newData;
}
