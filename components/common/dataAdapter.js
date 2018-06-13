'use strict';

export default function highchartsDataToG2Data(data, config) {
  if (!data) {
    return [];
  }
  if (!Array.isArray(data)) {
    data = [data];
  }
  const newData = [];
  if (Array.isArray(config.yAxis)) {
    data.forEach((oneData) => {
      const { name: dataName, yAxis: yIndex = 0 } = oneData;

      if (!Array.isArray(oneData.data)) {
        return;
      }

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra: [],
            type: dataName
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            [`y${yIndex}`]: y,
            extra,
            type: dataName
          });
        }
      });
    });
  } else {
    data.forEach((oneData) => {
      const { name: dataName, facet } = oneData;

      if (!Array.isArray(oneData.data)) {
        return;
      }

      oneData.data.forEach((d, i) => {
        if (Array.isArray(d)) {
          const [x, y, ...extra] = d;
          newData.push({
            x,
            y,
            extra,
            facet,
            type: dataName
          });
        } else if (config.xAxis && config.xAxis.categories && config.xAxis.categories[i]) {
          const x = config.xAxis.categories[i];
          const y = isNaN(d) ? d[0] : d;
          newData.push({
            x,
            y,
            extra: [],
            facet,
            type: dataName
          });
        } else {
          const { x, y, ...extra } = d;
          newData.push({
            x,
            y,
            extra,
            facet,
            type: dataName
          });
        }
      });
    });
  }
  return newData;
}
