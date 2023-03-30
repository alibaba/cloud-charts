import { VERSION, FullCamelName } from '../constants';
import chartQuality from './chartQuality';
import { numberDecimal } from './common';

// Teamix.test对接
// 跨源通信
// 图表库首次载入（理论仅发送一次
window.postMessage({
  source: "teamix-test-devtools",
  url: window.location.href,
  event: "getModuleInfo",
  moduleType: 'ApsaraStack',
  moduleName: "@alicloud/cloud-charts", // 图表库依赖名称
  moduleVersion: VERSION, // 图表库依赖版本
  componentName: FullCamelName, // 图表库通用组件名，没有可不填
},"*");

export function postMessage(resultData: any) {
  window.postMessage({
    source: 'teamix-test-devtools',
    moduleType: 'ApsaraStack',
    url: window.location.href,
    event: "getChartTestInfo",
    moduleName: "@alicloud/cloud-charts",
    moduleVersion: VERSION,
    resultData
  });
}

// 初始图表质量分数统计
// 汇总计算分数
// 初始为10分，根据错误率和权重扣分，最终每个图表取平均值
export function calcChartScore(logMap: any) {
  const score = 10;
  // 错误分数
  let errorScore = 0;
  // 图表数量， Wcontainer算在内
  let chartNumber = 0;
  // test后期会用
  const errorInfoArray: any = [];

  Object.keys(logMap).forEach((chartName: string) => {
    // console.log(logMap);
    chartNumber += logMap[chartName].init ?? 0;
    // 错误信息汇总
    errorInfoArray.push(logMap[chartName]?.rulesInfo ?? {});

    logMap[chartName]?.rulesInfo.forEach((subInfo: any) => {
      const ruleInfo = chartQuality[subInfo.checkItem] ?? {};
      // 错误分 = 权重 * 错误率， 0 为没错
      errorScore += numberDecimal((ruleInfo?.weight ?? 0) * (subInfo.errorInfo?.errorRate ?? 0))
    });

    // 容器单独计算
    if(chartName === 'Wcontainer') {
      // 错误分 = 权重 * 使用容器组件的次数
      errorScore += numberDecimal(chartQuality.Container.weight * (logMap[chartName]?.init ?? 0))
    }
  });
  // 计算平均分
  const avgErrorScore = numberDecimal(errorScore / chartNumber);
  // 计算总得分
  return {
    rate: numberDecimal(score - avgErrorScore),
    errorInfo: errorInfoArray
  };
}
