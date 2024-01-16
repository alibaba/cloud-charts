import RawLegendController from '@antv/g2/esm/chart/controller/legend';
import { Geometry } from '@antv/g2';
import { Attribute, CategoryLegend, Scale } from '@antv/g2/esm/dependents';
import { LegendCfg } from '@antv/g2/esm/interface';
// 引入自定义的图例组件
import ReactLegend from '../component/reactLegend';
import { FullCrossName } from '../../constants';

// @ts-ignore
class WidgetsLegendController extends RawLegendController {
  private parentDom: HTMLElement;

  private widgetsContainer: HTMLElement;

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

    this.widgetsContainer = this.parentDom.getElementsByClassName('widgets-legend')?.[0] as HTMLElement;

    // 列表型legend及折叠型legend
    if (legendOption?.table || legendOption?.foldable) {
      if (!this.widgetsContainer) {
        this.widgetsContainer = document.createElement('div');
        this.widgetsContainer.className = `${FullCrossName} widgets-legend`;
        const align = legendOption?.position?.split('-')?.[1] ?? 'center';
        const direction =
          align === 'center' ? 'center' : align === 'left' || align === 'top' ? 'flex-start' : 'flex-end';
        this.widgetsContainer.style.cssText = `width: 100%; display: flex; justify-content: ${direction}; align-items: ${direction}; overflow-x: auto;overflow-y: hidden;`;
        this.parentDom.appendChild(this.widgetsContainer);
      }

      this.widgetsContainer.style.visibility = 'visible';

      return new ReactLegend({
        cfg,
        container: this.widgetsContainer,
        chart: this.view,
        legendConfig: legendOption,
      });
    }

    if (this.widgetsContainer) {
      this.widgetsContainer.style.visibility = 'hidden';
    }

    // 普通legend
    return new CategoryLegend(cfg);
  }

  public clear() {
    super.clear();

    if (this.widgetsContainer) {
      this.widgetsContainer.style.visibility = 'hidden';
    }
  }

  public destroy() {
    super.destroy();

    // 销毁之前的legend widgetsContainer
    if (this.widgetsContainer) {
      this.parentDom.removeChild(this.widgetsContainer);
      this.widgetsContainer = null;
    }
  }
}

export default WidgetsLegendController;
