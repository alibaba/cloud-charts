import RawTooltipController from '@antv/g2/esm/chart/controller/tooltip';
import { Point } from '@antv/g2/esm/interface';
import ReactDOM from 'react-dom';
import { FullCrossName } from '../../constants';

// @ts-ignore
class WidgetsTooltipController extends RawTooltipController {
  private parentDom: HTMLElement;

  private tooltipContainer: HTMLElement;

  constructor(props: any) {
    super(props);

    this.parentDom = this.view.getCanvas().get('el').parentNode.parentNode.parentNode;
  }

  public showTooltip(point: Point) {
    const cfg = this.getTooltipCfg();
    // console.log('config', cfg);

    // 自定义tooltip
    if (cfg?.customTooltip) {
      // 创建容器
      if (!this.tooltipContainer) {
        const container = document.createElement('div');
        container.className = `${FullCrossName} widgets-tooltip`;
        container.style.cssText = `position: fixed;z-index: 1001; pointer-events: none; transition: left 0.1s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.1s cubic-bezier(0.23, 1, 0.32, 1) 0s;`;

        document.body.append(container);

        this.tooltipContainer = container;
      }

      this.tooltipContainer.style.visibility = 'visible';

      // 绘制
      const items = this.getTooltipItems(point);

      let title = '';
      try {
        // @ts-ignore
        title = this.getTitle(items);
      } catch (e) {}
      const element = cfg.customTooltip(title, items);
      ReactDOM.render(element, this.tooltipContainer);

      // 计算位置
      const padding = 10;
      const position = {
        x: point.x + padding,
        y: point.y,
      };
      let curElement = this.parentDom;
      while (curElement && curElement !== document.body) {
        position.x += curElement.offsetLeft;
        position.y += curElement.offsetTop;
        curElement = curElement.offsetParent as HTMLDivElement;
      }

      // 减去scroll的宽高
      curElement = this.parentDom;
      while (curElement && curElement !== document.body) {
        position.x -= curElement.scrollLeft;
        position.y -= curElement.scrollTop;
        curElement = curElement.parentElement as HTMLDivElement;
      }

      const tooltipRect = this.tooltipContainer.getBoundingClientRect();
      const bodyWidth = document.body.clientWidth;
      if (position.x + tooltipRect.width > bodyWidth) {
        // 超过屏幕时移至左边
        position.x = position.x - tooltipRect.width - padding * 2;
      }

      // 定位
      // @ts-ignore
      this.tooltipContainer.style.top = `${position.y}px`;
      // @ts-ignore
      this.tooltipContainer.style.left = `${position.x}px`;

      // 显示辅助线
      if (cfg?.showCrosshairs) {
        // @ts-ignore
        super.renderCrosshairs(point, cfg);
      }
    } else {
      super.showTooltip(point);
    }
  }

  public hideTooltip() {
    const cfg = this.getTooltipCfg();
    if (cfg?.customTooltip) {
      if (this.tooltipContainer) {
        this.tooltipContainer.style.visibility = 'hidden';
      }

      // hide crosshairs
      // @ts-ignore
      const { xCrosshair, yCrosshair } = this;
      if (xCrosshair) {
        xCrosshair.hide();
      }
      if (yCrosshair) {
        yCrosshair.hide();
      }
    } else {
      super.hideTooltip();
    }
  }

  public destroy() {
    const cfg = this.getTooltipCfg();
    if (cfg?.customTooltip) {
      if (this.tooltipContainer) {
        document.body.removeChild(this.tooltipContainer);
        this.tooltipContainer = null;
      }

      // clear crosshairs
      // @ts-ignore
      const { xCrosshair, yCrosshair } = this;
      if (xCrosshair) {
        xCrosshair.clear();
      }
      if (yCrosshair) {
        yCrosshair.clear();
      }
    } else {
      super.destroy();
    }
  }
}

export default WidgetsTooltipController;
