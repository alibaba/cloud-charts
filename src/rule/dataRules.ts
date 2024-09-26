// 统一数据处理
export function runDataRules(data: any, config: any) {
  const dataList = data.map((el: any) => el.y);
  let maxDecimals = 0;
  let minDecimals = 4;

  dataList?.forEach((number: number) => {
    // 将数字转换为字符串，然后查找小数点后的字符长度
    const decimals = number.toString().split('.')[1] ? number.toString().split('.')[1].length : 0;
    // 更新最大小数位数
    if (decimals > maxDecimals) {
      maxDecimals = decimals;
    }
    if (decimals < minDecimals) {
      minDecimals = decimals
    }
  });

  if (!config.yAxis?.decimal && !config?.closeDataRules) {
    config.decimal = maxDecimals;
    
    if (config.yAxis) {
      config.yAxis.decimal = maxDecimals;
    } else {
      config.yAxis = {
        decimal: maxDecimals
      };
    }
  }

  return {
    data,
    config
  };
}
