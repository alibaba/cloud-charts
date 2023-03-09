import { VERSION, FullCamelName } from '../constants';

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
