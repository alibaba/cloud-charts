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

    // 自定义tooltip
    if (cfg?.customTooltip) {
      // 创建容器
      if (!this.tooltipContainer) {
        const container = document.createElement('div');
        container.className = `${FullCrossName} widgets-tooltip`;
        container.style.cssText = `position: absolute;z-index: 1001; pointer-events: none; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;`;

        document.body.append(container);

        this.tooltipContainer = container;
      }

      this.tooltipContainer.style.visibility = 'visible';

      // 绘制
      const items = this.getTooltipItems(point);
      // @ts-ignore
      const title = this.getTitle(items);
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
    } else {
      super.destroy();
    }
  }
}

export default WidgetsTooltipController;
