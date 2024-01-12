import RawLegendController from '@antv/g2/esm/chart/controller/legend';
import { Geometry } from '@antv/g2';
import { Attribute, CategoryLegend, Scale } from '@antv/g2/esm/dependents';
import { LegendCfg } from '@antv/g2/esm/interface';
// 引入自定义的图例组件
import ReactLegend from '../component/reactLegend';

// @ts-ignore
class WidgetsLegendController extends RawLegendController {
  private parentDom: HTMLElement;

  constructor(props: any) {
    super(props);

    this.parentDom = this.view.getCanvas().get('el').parentNode.parentNode.parentNode;
  }

  // @ts-ignore
  private createCustomLegend(geometry: Geometry, attr: Attribute, scale: Scale, legendOption: LegendCfg) {
    // 直接使用 分类图例渲染
    // @ts-ignore
    const cfg = this.getCategoryCfg(geometry, attr, scale, legendOption, true);
    return new CategoryLegend(cfg);
  }

  // @ts-ignore
  private createCategoryLegend(geometry: Geometry, attr: Attribute, scale: Scale, legendOption: any) {
    // @ts-ignore
    const cfg = this.getCategoryCfg(geometry, attr, scale, legendOption);

    // 列表型legend及折叠型legend
    if (legendOption?.table || legendOption?.foldable) {
      return new ReactLegend({
        cfg,
        parentDom: this.parentDom,
        chart: this.view,
        legendConfig: legendOption,
      });
    }

    // 普通legend
    return new CategoryLegend(cfg);
  }
}

export default WidgetsLegendController;
