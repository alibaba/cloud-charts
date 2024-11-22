import RawTooltipController from '@antv/g2/esm/chart/controller/tooltip';
import { Point } from '@antv/g2/esm/interface';
import ReactDOM from 'react-dom';
import { FullCrossName, HideTooltipEventName } from '../../constants';
import FreeTooltip from '../component/FreeTooltip';
import React from 'react';
import { getRawData, customFormatter } from '../../common/common';

// @ts-ignore
class WidgetsTooltipController extends RawTooltipController {
  private parentDom: HTMLElement;

  private tooltipContainer: HTMLElement;

  // 锁定tooltip时，图表容器的位置信息
  private startRect: any;

  // 锁定tooltip时，tooltip的起始位置
  private startPosition: { x: number; y: number };

  // 计时器，用于防抖
  private timer: any;

  // 监听器，用于监听图表是否可见
  private observer: any;

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

      // 进位相关配置项
      let formatConfig: any;
      // 当tooltip中配置了单位相关信息时，直接使用tooltip的配置项，否则使用y轴配置项
      if (
        typeof config?.tooltip === 'object' &&
        (config?.tooltip?.valueType ||
          config?.tooltip?.unit ||
          config?.tooltip?.needUnitTransform ||
          config?.tooltip?.unitTransformTo)
      ) {
        formatConfig = config.tooltip;
      } else if (Array.isArray(config.yAxis) && config.yAxis.length >= 2) {
        // 双轴
        formatConfig = config.yAxis;
      } else if (Array.isArray(config.yAxis)) {
        formatConfig = config?.yAxis?.[0] ?? {};
      } else {
        formatConfig = config?.yAxis ?? {};
      }

      // const customValueFormatter = customFormatter(formatConfig);

      items.forEach((item: any, index: number) => {
        // @ts-ignore
        const raw = getRawData(config, this?.view?.widgetsCtx?.rawData, item);

        if (config?.tooltip?.valueFormatter) {
          item.value = config?.tooltip?.valueFormatter(item.value, raw, index, items);
        } else {
          let customValueFormatter = null;
          if (Array.isArray(formatConfig)) {
            // 双轴
            customValueFormatter =
              'y1' in item?.data ? customFormatter(formatConfig[1]) : customFormatter(formatConfig[0]);
          } else {
            // 单轴
            customValueFormatter = customFormatter(formatConfig);
          }

          if (customValueFormatter) {
            item.value = customValueFormatter(item.value);
          }
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

  // 锁定tooltip时监听滚动事件
  public handleScroll = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.timer = setTimeout(() => {
      // 图表父元素的当前位置
      const currentRect = this.parentDom.getBoundingClientRect();

      const offsetX = currentRect.x - this.startRect.x;
      const offsetY = currentRect.y - this.startRect.y;

      this.tooltipContainer.style.left = `${this.startPosition.x + offsetX}px`;
      this.tooltipContainer.style.top = `${this.startPosition.y + offsetY}px`;

      clearTimeout(this.timer);
      this.timer = null;
    }, 50);
  };

  public lockTooltip() {
    super.lockTooltip();

    if (this.tooltipContainer) {
      this.tooltipContainer.style.pointerEvents = 'auto';

      this.observer = new IntersectionObserver((entries: any[]) => {
        for (const entry of entries) {
          // 元素离开视口
          if (!entry.isIntersecting) {
            this.unlockTooltip();
            this.hideTooltip();
          }
        }
      });

      this.observer.observe(this.parentDom);

      window.addEventListener(HideTooltipEventName, () => {
        this.unlockTooltip();
        this.hideTooltip();
      });
    }
  }

  public unlockTooltip() {
    super.unlockTooltip();
    if (this.tooltipContainer) {
      this.tooltipContainer.style.pointerEvents = 'none';

      this.observer.disconnect();

      window.removeEventListener(HideTooltipEventName, () => {
        this.unlockTooltip();
        this.hideTooltip();
      });
    }
  }
}

export default WidgetsTooltipController;
