import { registerComponentController, unregisterComponentController } from '@antv/g2/esm/chart/controller/index';
import WidgetsLegendController from './legend';
import WidgetsTooltipController from './tooltip';

// 注入切面控制器，需要使用函数写法，避免被 tree-shaking 去除代码
export default function registerAopController() {
  // 卸载默认的 legend 控制器
  unregisterComponentController('legend');
  // 注册自定义的 legend 控制器
  registerComponentController('legend', WidgetsLegendController);

  // 卸载默认的 tooltip 控制器
  unregisterComponentController('tooltip');
  // 注册自定义的 legend 控制器
  registerComponentController('tooltip', WidgetsTooltipController);
}
