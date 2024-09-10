import RawLegendController from '@antv/g2/esm/chart/controller/legend';
import { Geometry } from '@antv/g2';
import { Attribute, CategoryLegend, Scale } from '@antv/g2/esm/dependents';
import { LegendCfg } from '@antv/g2/esm/interface';
// 引入自定义的图例组件
import ReactLegend from '../component/reactLegend';
import { FullCrossName } from '../../constants';
import { View } from '@antv/g2/esm';
import { merge } from '../../common/common';
import { getStatistics } from '../../common/chartRefs';

// @ts-ignore
class WidgetsLegendController extends RawLegendController {
  private parentDom: HTMLElement;

  private legendContainer: HTMLElement;

  constructor(view: View) {
    super(view);

    this.parentDom = this.view.getCanvas().get('el').parentNode.parentNode.parentNode;

    this.legendContainer = document.createElement('div');
    this.legendContainer.className = `${FullCrossName} widgets-legend`;
    this.parentDom.appendChild(this.legendContainer);
  }

  layout() {
    const widgetsCtx = (this.view as any)?.widgetsCtx;
    if (!widgetsCtx?.size) {
      return;
    }
    const [w, h] = widgetsCtx?.size;
    const legendConfig: any = {};
    const globalBaseConfig = widgetsCtx?.context?.defaultConfig?.baseConfig;
    const globalComsConfig = widgetsCtx?.context?.defaultConfig?.[widgetsCtx.chartName.replace('G2', '')] ?? {};
    merge(
      legendConfig,
      widgetsCtx?.defaultConfig?.legend ?? {},
      globalBaseConfig?.legend ?? {},
      globalComsConfig?.legend ?? {},
      widgetsCtx?.props?.config?.legend ?? {},
    );

    if (
      !widgetsCtx?.isEmpty &&
      !widgetsCtx?.props?.loading &&
      !widgetsCtx?.props?.errorInfo &&
      legendConfig?.visible !== false &&
      (legendConfig?.table || legendConfig?.gradient || legendConfig?.foldable)
    ) {
      const legendElement = this.legendContainer?.childNodes?.[0];
      const position = (legendConfig?.position ?? 'bottom').split('-')[0];

      // 根据legend配置项计算图表宽高
      let size = [w, h];
      let legendSize = [0, 0];
      let legendMaxSize = null;
      if (legendConfig?.table) {
        // 根据数据量计算高度
        // 目前暂时对多重圆环进行特殊处理，待规则统一梳理后，整理数据类型
        const dataType = widgetsCtx.chartName === 'G2MultiPie' ? 'treeNode' : 'common';
        const items = getStatistics(widgetsCtx.chart, [], widgetsCtx?.legendField || 'type', dataType);
        const num = Object.keys(items).length ?? 0;

        if (position === 'right') {
          size = [w / 2, h];
          const height = legendConfig?.table?.style?.height ?? Math.min(h, 20 * (num + 1));
          legendSize = [w / 2, height];
          legendMaxSize = [w / 2, h];
        } else {
          const height = legendConfig?.table?.style?.height ?? Math.min(h * 0.3, 20 * (num + 1));
          size = [w, h - height];
          legendSize = [w, height];
          legendMaxSize = [w, height];
        }
      } else if (legendConfig?.gradient) {
        size = [w, h - 50];
        legendSize = [w, 50];
        legendMaxSize = [w, 50];
      } else if (legendConfig?.foldable) {
        if (widgetsCtx.legendFolded || widgetsCtx.legendFolded === undefined) {
          size = [w, h - 20];
          legendSize = [w, 20];
        } else {
          // 折叠型legend的展开逻辑在FoldableLegend内实现
          if (legendElement) {
            legendElement.style.width = 'auto';
            legendElement.style.height = 'auto';
          }
          return;
        }
      }
      // @ts-ignore
      this.view.changeSize(size[0], size[1]);

      // 设置图表宽高
      const chartContainer = this.view.getCanvas().get('el').parentNode.parentNode;
      chartContainer.style.width = `${size[0]}px`;
      chartContainer.style.height = `${size[1]}px`;

      // 设置legend宽高
      if (legendElement) {
        legendElement.style.width = `${legendSize[0]}px`;
        legendElement.style.height = `${legendSize[1]}px`;
        if (legendMaxSize) {
          legendElement.style.maxHeight = `${legendMaxSize[1]}px`;
        }
      }
    } else {
      super.layout();
    }
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

    this.legendContainer = this.parentDom.getElementsByClassName('widgets-legend')?.[0] as HTMLElement;

    // // 当以下配置项生效时，使用g2 原生legend
    // if (
    //   !table &&
    //   !foldable &&
    //   (autoCollapse ||
    //     collapseRow ||
    //     showData ||
    //     marker ||
    //     allowAllCanceled ||
    //     hoverable === false ||
    //     onHover ||
    //     clickable === false ||
    //     onClick ||
    //     customConfig ||
    //     maxWidth ||
    //     maxHeight ||
    //     maxWidthRatio ||
    //     maxHeightRatio ||
    //     useReverseChecked === false ||
    //     dodge)
    // ) {
    //   console.log('normal', this.view?.widgetsCtx?.props?.config?.legend);
    //   // 普通legend
    //   return new CategoryLegend(cfg);
    // }

    // 使用自定义的legend：列表型legend、折叠型legend或阶梯状legend
    if (legendOption?.table || legendOption?.foldable || legendOption?.gradient) {
      // if (!this.legendContainer) {
      //   this.legendContainer = document.createElement('div');
      //   this.legendContainer.className = `${FullCrossName} widgets-legend`;
      //   this.parentDom.appendChild(this.legendContainer);
      // }
      const position = legendOption?.position?.split('-')?.[0];
      const align = legendOption?.position?.split('-')?.[1] ?? 'center';
      const directionX = ['top', 'bottom'].includes(position)
        ? align === 'center'
          ? 'center'
          : align === 'left' || align === 'top'
          ? 'flex-start'
          : 'flex-end'
        : 'flex-start';

      const directionY =
        align === 'center' ? 'center' : align === 'left' || align === 'top' ? 'flex-start' : 'flex-end';
      this.legendContainer.style.cssText = `width: 100%; display: flex; justify-content: ${directionX}; align-items: ${directionY}; overflow-x: auto;overflow-y: hidden;`;

      this.legendContainer.style.visibility = 'visible';

      return new ReactLegend({
        cfg,
        container: this.legendContainer,
        chart: this.view,
        legendConfig: legendOption,
      });
    }

    this.legendContainer.style.visibility = 'hidden';

    // 普通legend
    return new CategoryLegend(cfg);
  }

  public clear() {
    super.clear();

    if (this.legendContainer) {
      this.legendContainer.style.visibility = 'hidden';
    }
  }

  public destroy() {
    super.destroy();

    // 销毁之前的legend legendContainer
    if (this.legendContainer) {
      this.parentDom.removeChild(this.legendContainer);
      this.legendContainer = null;
    }
  }
}

export default WidgetsLegendController;
