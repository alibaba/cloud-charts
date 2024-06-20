import rules from './index';

/** 根据配置项与数据判断图表类型 */
export function classifyChart(chartName: string, data: any, config: any) {
  const parentRule = (rules as any)[chartName];
  if (!parentRule) {
    return null;
  }

  // 若无分类函数，则直接使用父类规则
  if (!parentRule?.classify) {
    return parentRule;
  }

  // 增加预处理配置项
  if (parentRule?.processConfig) {
    config = parentRule?.processConfig(config);
  }

  // 根据父类的classify判断该图属于哪个子类（或基础父类）
  const category = parentRule?.classify(data, config);

  if (!category) {
    // 没有对应规则
    return null;
  } else if (category === parentRule.id) {
    // 基础类，直接用父类规则
    return parentRule;
  } else {
    // 非基础类，需要找到对应子类
    const { children = {} } = parentRule;
    const childRule = children[category];

    // 合并父类与子类的规则
    return {
      ...parentRule,
      ...childRule,
    };
  }
}
