import RawTooltipController from '@antv/g2/esm/chart/controller/tooltip';
import { Point } from '@antv/g2/esm/interface';
import ReactDOM from 'react-dom';
import { FullCrossName } from '../../constants';
import FreeTooltip from '../component/FreeTooltip';
import React from 'react';
import { getRawData, customFormatter } from '../../common/common';

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
      if (cfg?.showTitle) {
        try {
          // @ts-ignore
          title = this.getTitle(items);
        } catch (e) {}
      }

      // 配置项处理
      const config = (this?.view as any)?.widgetsCtx?.mergeConfig ?? {};

      const formatConfig = typeof config.yAxis === 'object' && !Array.isArray(config.yAxis) ? config.yAxis : {};
      const customValueFormatter = customFormatter(config.tooltip === true ? formatConfig : config.tooltip || {});

      items.forEach((item: any, index: number) => {
        // @ts-ignore
        const raw = getRawData(config, this?.view?.widgetsCtx?.rawData, item);

        if (config?.tooltip?.valueFormatter) {
          item.value = config?.tooltip?.valueFormatter(item.value, raw, index, items);
        } else if (customValueFormatter) {
          item.value = customValueFormatter(item.value);
        }
        if (item.name.startsWith('undefined-name-')) {
          item.name = '';
        } else if (config?.tooltip?.nameFormatter) {
          item.name = config?.tooltip?.nameFormatter(item.name, raw, index, items);
        }
      });

      const element =
        cfg.customTooltip === true ? <FreeTooltip title={title} data={items} /> : cfg.customTooltip(title, items);
      ReactDOM.render(element, this.tooltipContainer);

      // 计算位置
      const padding = 10;
      const position = {
        x: point.x + padding,
        y: point.y,
      };
      const parentRect = this.parentDom.getBoundingClientRect();
      position.x += parentRect.left;
      position.y += parentRect.top;

      const tooltipRect = this.tooltipContainer.getBoundingClientRect();
      const bodyWidth = document.body.clientWidth;
      const bodyHeight = document.body.clientHeight;
      if (position.x + tooltipRect.width > bodyWidth) {
        // 超过屏幕时移至左边
        position.x = position.x - tooltipRect.width - padding * 2;
      }
      if (position.y + tooltipRect.height > bodyHeight) {
        // 超过屏幕时移至上方
        position.y = position.y - tooltipRect.height - padding;
      }

      // 定位
      // @ts-ignore
      this.tooltipContainer.style.top = `${position.y}px`;
      // @ts-ignore
      this.tooltipContainer.style.left = `${position.x}px`;

      if (cfg?.showMarkers) {
        // @ts-ignore
        this.renderTooltipMarkers(items, cfg.marker);
      }

      // 显示辅助线
      if (cfg?.showCrosshairs && items?.length) {
        const dataPoint = {
          x: items[0]?.x,
          y: items[0]?.y,
        }; // 数据点位置
        const isCrosshairsFollowCursor = cfg?.crosshairs?.follow || false;
        // @ts-ignore
        super.renderCrosshairs(isCrosshairsFollowCursor ? point : dataPoint, cfg);
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

      // @ts-ignore hide the tooltipMarkers
      const tooltipMarkersGroup = this.tooltipMarkersGroup;
      if (tooltipMarkersGroup) {
        tooltipMarkersGroup.hide();
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
