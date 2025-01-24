import { cloneDeep } from 'lodash';

// 统一数据处理
export function runDataRules(data: any, config: any) {
  const sourceData = cloneDeep(data);

  if (Array.isArray(sourceData)) {
    const dataList = sourceData?.map((el: any) => el.y || el?.y0 || el?.y1);
    let maxDecimals = 0;
    let minDecimals = 4;

    dataList?.forEach((number: number) => {
      if (number && number?.toString()?.includes('.')) {
        // 将数字转换为字符串，然后查找小数点后的字符长度
        const decimals = number.toString().split('.')[1]
          ? number.toString().split('.')[1].length
          : 0;
        // 更新最大小数位数
        if (decimals > maxDecimals) {
          maxDecimals = decimals;
        }
        if (decimals < minDecimals) {
          minDecimals = decimals;
        }
      }
    });

    // 兜底6位
    if (maxDecimals > 6) {
      maxDecimals = 6;
    }

    if (!config.yAxis?.decimal && !config?.closeDataRules && maxDecimals !== 0) {
      config.decimal = maxDecimals;

      if (!Array.isArray(config.yAxis)) {
        if (config.yAxis) {
          config.yAxis.decimal = maxDecimals;
        } else {
          config.yAxis = {
            decimal: maxDecimals,
          };
        }
      }
    }
  }

  return {
    data,
    config,
  };
}
