import { warn } from '../common/log';

// 配置项处理（后置）
export function processFinalConfig(chartObj: any, config: any) {
  const { chartName, chartRule } = chartObj;
  const { force } = chartObj.props;
  let finalConfig = config;

  // 检测饼图、多重饼图、多重圆环是否有chilren
  if (['G2Pie', 'G2MultiPie', 'G2MultiCircle'].includes(chartName) && chartObj.props.children) {
    // @ts-ignore
    if (config?.innerContent) {
      warn(`W${chartName.slice(2)}`, '图表的中心内容innerContent配置项会被chilren覆盖，建议删除chilren');
    } else {
      warn(`W${chartName.slice(2)}`, '推荐通过innerContent配置项设置中心内容');
    }
  }

  // 配置项处理
  if (force !== true && chartRule?.processConfig) {
    finalConfig = chartRule.processConfig(finalConfig);
  }

  return finalConfig;
}
