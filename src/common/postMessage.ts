import { VERSION, FullCamelName } from '../constants';
import chartQuality from './chartQuality';

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
  window?.postMessage({
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
  // 统计config使用
  const configInfoArray: any = [];
  // 统计图表性能（渲染时间）
  const renderTimeArray: any = [];

  Object.keys(logMap).forEach((chartName: string) => {
    // console.log(logMap);
    chartNumber += logMap[chartName].init ?? 0;
    // 错误信息汇总
    logMap[chartName]?.rulesInfo?.length !== 0 && errorInfoArray.push(logMap[chartName]?.rulesInfo);
    logMap[chartName]?.configInfo?.length !== 0 && configInfoArray.push(logMap[chartName]?.configInfo);
    logMap[chartName]?.renderTimeArray?.length !== 0 && renderTimeArray.push(logMap[chartName]?.renderTimeArray);

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
  const avgErrorScore = chartNumber === 0 ? 0 : numberDecimal(errorScore / chartNumber);
  // 计算总得分
  return {
    rate: numberDecimal(score - avgErrorScore),
    errorInfo: errorInfoArray,
    configIngo: configInfoArray,
    renderInfo: renderTimeArray,
    chartInfo: {
      // 图表数量（去除废弃组件）
      chartRealSum: chartNumber - (logMap.Wcontainer?.init?? 0),
      // 图表数量（包含废弃组件）
      chartSum: chartNumber,
      logMap
    }
  };
}

// 解决循环依赖的问题，原先这个工具函数在common内，就会导致以下情况
// index -> theme -> log -> postMessage -> common -> log
function numberDecimal(num: any, decimal = 2) {
  // 小数位被转换为整数且不小于0
  let d = Math.max(0, Math.round(decimal));
  return Math.round(Number(num) * Math.pow(10, d)) / Math.pow(10, d);
}
