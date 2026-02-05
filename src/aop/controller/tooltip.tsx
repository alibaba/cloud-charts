import RawTooltipController from '@antv/g2/esm/chart/controller/tooltip';
import { Point } from '@antv/g2/esm/interface';
import ReactDOM from 'react-dom';
import { FullCrossName, HideTooltipEventName } from '../../constants';
import FreeTooltip from '../component/FreeTooltip';
import { PrefixName } from '../../constants';
import React from 'react';
import { getRawData, customFormatter } from '../../common/common';
import '../component/FreeTooltip/index.scss';
import { calcTextWidth } from '../../common/ellipsisLabel';

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
    const items = this.getTooltipItems(point);

    if (!items?.length) {
      return;
    }

    // 自定义tooltip
    if (cfg?.customTooltip) {
      // 创建容器
      if (!this.tooltipContainer) {
        const container = document.createElement('div');
        container.className = `${FullCrossName} widgets-tooltip`;
        container.style.cssText = `position: fixed;z-index: 1001; pointer-events: none; top: 0; left: 0;`;

        document.body.append(container);

        this.tooltipContainer = container;
      }

      this.tooltipContainer.style.visibility = 'visible';

      // 图表离开视窗时隐藏tooltip
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

      // 通过事件手动隐藏tooltip
      window.addEventListener(HideTooltipEventName, () => {
        this.unlockTooltip();
        this.hideTooltip();
      });

      // 绘制

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

      // 计算位置和尺寸
      const padding = 10;
      const position = {
        x: point.x + padding,
        y: point.y,
      };

      const parentRect = this.parentDom.getBoundingClientRect();
      const bodyWidth = document.body.clientWidth;
      const bodyHeight = document.body.clientHeight;

      position.x += parentRect.left;
      position.y += parentRect.top;

      // 根据title与items计算内部尺寸
      const maxName = (items || []).reduce((longest, current) =>
        current.name.length + current.value.toString().length > longest.name.length + longest.value.toString().length
          ? current
          : longest,
      );
      const innerSize = {
        width: calcTextWidth(`${maxName.name}${maxName.value}`) + (maxName?.color ? 10 : 0) + 8 + 24 + 12 + 4,
        height: (title ? 26 : 0) + (items?.length || 0) * 18 + (items?.length > 0 ? items.length - 1 : 0) * 8 + 24,
      };

      const size = {
        width: Math.min(bodyWidth / 4, innerSize.width),
        height: Math.min(bodyHeight / 2, innerSize.height),
      };

      // 宽度超过屏幕时
      if (position.x + size.width > bodyWidth) {
        // 判断左边和右边哪边区域更大就放哪边
        const leftWidth = position.x - padding;
        const rightWidth = bodyWidth - position.x - padding;
        if (leftWidth > rightWidth) {
          // 移至左侧
          position.x = Math.max(position.x - size.width - padding, 0);
          size.width = Math.min(size.width, leftWidth);
        } else {
          // 依然在右侧，缩小宽度
          size.width = Math.min(size.width, rightWidth);
        }
      }

      // 高度超过屏幕时
      if (position.y + size.height > bodyHeight) {
        // 判断上边和下边哪边区域更大就放哪边
        const topHeight = position.y - padding;
        const bottomHeight = bodyHeight - position.y - padding;

        if (topHeight > bottomHeight) {
          // 移至上方
          position.y = Math.max(position.y - size.height - padding, 0);
          size.height = Math.min(size.height, topHeight);
        } else {
          // 依然在下方，缩小高度
          size.height = Math.min(size.height, bottomHeight);
        }
      }

      // 定位
      // @ts-ignore
      this.tooltipContainer.style.transform = `translate3d(${position.x}px, ${position.y}px, 0px)`;
      this.tooltipContainer.style.width = `${size.width}px`;
      this.tooltipContainer.style.height = `${size.height}px`;

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

    // 开启锁定时绘制锁定icon
    if (cfg?.lockable) {
      this.drawLockElement(false);
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

      // this.tooltipContainer.style.left = `${this.startPosition.x + offsetX}px`;
      // this.tooltipContainer.style.top = `${this.startPosition.y + offsetY}px`;
      this.tooltipContainer.style.transform = `translate3d(${this.startPosition.x + offsetX}px, ${
        this.startPosition.y + offsetY
      }px, 0px)`;

      clearTimeout(this.timer);
      this.timer = null;
    }, 50);
  };

  public lockTooltip() {
    super.lockTooltip();

    if (this.tooltipContainer) {
      this.tooltipContainer.style.pointerEvents = 'auto';
    }

    this.drawLockElement(true);
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

    this.drawLockElement(false);
  }

  // 绘制锁定相关元素
  public drawLockElement(locked: boolean) {
    const curTooltipContainer = this.tooltipContainer || this.parentDom.querySelector('.g2-tooltip');

    if (!curTooltipContainer) {
      return;
    }

    const lockIcon = (
      <svg viewBox="0 0 1024 1024" width="12" height="12">
        <path d="M921.6 391.68l-288-288c-5.12-5.12-11.52-7.68-17.92-7.68s-13.44 2.56-17.92 7.68L497.28 203.52c-5.12 4.48-7.68 11.52-7.68 17.92s2.56 13.44 7.68 17.92l51.84 51.84-241.28 104.32c-3.2 1.28-5.76 3.2-7.68 5.12L202.88 497.92c-10.24 10.24-10.24 26.24 0 36.48l85.76 85.76-185.6 257.92c-8.96 12.8-7.68 30.08 3.2 40.96 6.4 6.4 14.72 9.6 23.04 9.6 6.4 0 12.8-1.92 18.56-5.76l262.4-181.76 81.28 81.28c10.24 10.24 26.24 10.24 36.48 0l96.64-96.64c1.92-1.92 3.84-4.48 5.12-7.68L737.28 480l48 48c5.12 5.12 11.52 7.68 17.92 7.68s13.44-2.56 17.92-7.68L921.6 427.52c5.12-5.12 7.68-11.52 7.68-17.92s-3.2-13.44-7.68-17.92z"></path>
      </svg>
    );

    const unlockIcon = (
      <svg viewBox="0 0 1024 1024" width="12" height="12">
        <path d="M920.32 391.68l-288-288c-4.48-5.12-10.88-7.68-17.92-7.68s-13.44 2.56-17.92 7.68L496 203.52c-5.12 5.12-7.68 11.52-7.68 17.92s2.56 13.44 7.68 17.92l51.84 51.84-241.28 104.32c-3.2 1.28-5.76 3.2-7.68 5.12L202.24 497.92c-10.24 10.24-10.24 26.24 0 36.48L288 620.16l-185.6 257.92c-8.96 12.8-7.68 30.08 3.2 40.96 6.4 6.4 14.72 9.6 23.04 9.6 6.4 0 12.8-1.92 18.56-5.76l262.4-181.76 81.28 81.28c10.24 10.24 26.24 10.24 36.48 0l96.64-96.64c1.92-1.92 3.84-4.48 5.12-7.68L736 480l48 48c5.12 5.12 11.52 7.68 17.92 7.68s13.44-2.56 17.92-7.68l100.48-100.48c5.12-5.12 7.68-11.52 7.68-17.92s-2.56-13.44-7.68-17.92z m-117.12 63.36l-51.84-51.84c-5.76-5.76-13.44-7.68-21.12-6.4-7.68 1.28-14.08 6.4-17.28 13.44l-135.04 270.08L508.8 748.8l-72.96-72.96c-8.32-8.32-21.12-9.6-30.72-2.56l-239.36 183.68 188.16-234.24c7.04-9.6 5.76-22.4-2.56-30.72l-76.8-76.8 68.48-68.48 273.92-131.2c7.04-3.2 12.16-9.6 14.08-17.28 1.28-7.68-1.28-16-6.4-21.12l-55.68-55.68 45.44-45.44L848 409.6l-44.8 45.44z"></path>
      </svg>
    );

    const lockElement = (
      <>
        <div className={`${PrefixName}-free-tooltip-lock-icon-background`}></div>
        <div className={`${PrefixName}-free-tooltip-lock-icon-container`}>{locked ? lockIcon : unlockIcon}</div>
      </>
    );

    let lockContainer = curTooltipContainer?.querySelector(`.${PrefixName}-free-tooltip-lock-container`);

    if (lockContainer) {
      ReactDOM.render(lockElement, lockContainer);
    } else {
      lockContainer = document.createElement('div');
      lockContainer.className = `${PrefixName}-free-tooltip-lock-container`;
      ReactDOM.render(lockElement, lockContainer);
      curTooltipContainer.appendChild(lockContainer);
    }
  }
}

export default WidgetsTooltipController;
