'use strict';

export default function highchartsDataToG2Data(data, config) {
  const newData = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach((oneData) => {
      const { name: dataName, yAxis: yIndex = 0 } = oneData;

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            ['y' + yIndex]: y,
            extra,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            ['y' + yIndex]: y,
            extra: [],
            type: dataName
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            ['y' + yIndex]: y,
            extra,
            type: dataName
          });
        }
      });
    });
  } else {
    data.forEach((oneData) => {
      const { name: dataName } = oneData;

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            y,
            extra,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            y,
            extra: [],
            type: dataName
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            y,
            extra,
            type: dataName
          });
        }
      });
    });
  }
  return newData;
}