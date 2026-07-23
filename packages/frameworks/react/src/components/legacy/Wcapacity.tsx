// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';
import { chartLog, FullCrossName, PrefixName } from './_utils';

const prefix = `${FullCrossName} ${PrefixName}-wcapacity`;

// Inline interface definitions (from src/Wcapacity/interface.ts)
interface GuideConfig {
  threshold: string;
  status: string;
}

export interface WcapacityConfigItem {
  barConfig?: any;
  size?: string;
  barSize?: number | string;
  startColor?: string;
  endColor?: string;
  percentConfig?: any;
  guide?: GuideConfig;
  processBarConfig?: any;
  processBarBackConfig?: any;
  labelConfig?: any;
  titleConfig?: any;
  closeUniAnimation?: boolean;
}

export interface WcapacityProps {
  data?: any;
  config?: WcapacityConfigItem;
  height?: number;
  style?: any;
}

// Hardcoded theme colors (previously from themes)
const themeColors: Record<string, string> = {
  'widgets-capacity-color-grey': '#E4E7ED',
  'widgets-color-green': '#2FC25B',
  'widgets-color-orange': '#F5A623',
  'widgets-color-red': '#F56C6C',
  'widgets-color-normal': '#4A90D9',
  'widgets-tooltip-cross-line': '#DFDFDF',
  'widgets-global-uni-animation': '',
};

// Simplified GlobalResizeObserver inlined for this component
const InlineResizeObserver = (() => {
  const ATTR_NAME = 'legacy-capacity-resizeobserver-key';
  const callbackMap = new WeakMap<Element, (entry: ResizeObserverEntry) => void>();
  let resizeObserver: ResizeObserver | null = null;

  function getObserver() {
    if (!resizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const el = entry.target;
          const attrValue = el.getAttribute(ATTR_NAME);
          if (attrValue && callbackMap.has(el)) {
            const cb = callbackMap.get(el);
            if (typeof cb === 'function') cb(entry);
          }
        }
      });
    }
    return resizeObserver;
  }

  return {
    observe(element: Element, callback: any) {
      if (!(element instanceof Element)) return;
      let attrValue = element.getAttribute(ATTR_NAME);
      if (!attrValue) {
        attrValue = String(Math.random());
        element.setAttribute(ATTR_NAME, attrValue);
      }
      callbackMap.set(element, callback);
      getObserver().observe(element);
    },
    unobserve(element: Element) {
      if (!(element instanceof Element)) return;
      const attrValue = element.getAttribute(ATTR_NAME);
      if (attrValue && callbackMap.has(element)) {
        callbackMap.delete(element);
        getObserver().unobserve(element);
      }
    },
  };
})();

function getClipPath(width: number, height: number) {
  return [
    'M0,10',
    `Q${0.125 * width},${height} ${0.25 * width},${height / 4}`,
    `Q${0.375 * width},${-height / 4} ${0.5 * width},${height / 2}`,
    `Q${0.625 * width},${height} ${0.75 * width},${height / 4}`,
    `Q${0.875 * width},${-height / 4} ${width},${height / 2}`,
    `L${width},0`,
    `L${width},${height}`,
    `L0,${height}`,
    'L0,0',
    'Z',
  ].join(' ');
}

// Simplified Wnumber replacement - just renders children in a span
function NumberDisplay(props: { className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return <span className={props.className} style={props.style}>{props.children}</span>;
}

// Inline PercentBar component
function PercentBar(props: { data: any; config: WcapacityConfigItem; prefix: string }) {
  const { data, config, prefix: pfx } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [offsetX, setOffsetX] = useState(0);

  const statusColors: Record<string, string> = {
    normal: themeColors['widgets-capacity-color-grey'],
    success: themeColors['widgets-color-green'],
    warning: themeColors['widgets-color-orange'],
    error: themeColors['widgets-color-red'],
  };

  const unityAnimation = (waterWidth: number) => {
    const currentX = ref?.current?.getBoundingClientRect()?.left ?? 0;
    const capcityList = document.getElementsByClassName(`${pfx}-percent-container`);
    let minX = 9999999;

    for (let i = 0; i < capcityList?.length; i++) {
      const x_position = capcityList[i].getBoundingClientRect().left;
      minX = Math.min(minX, x_position);
    }

    const distance = Math.ceil(currentX) === Math.ceil(minX) ? 0 : currentX - minX - waterWidth;
    const offset = distance - Math.floor(distance / waterWidth) * waterWidth;
    setOffsetX(offset);
  };

  useEffect(() => {
    let timer: any;

    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!ref.current) return;
        const waterWidth = ref?.current?.clientWidth ?? 0;
        setWidth(waterWidth);
        if (!config?.closeUniAnimation) {
          unityAnimation(waterWidth);
        }
      }, 0);
    };

    handleResize();

    const parent = ref.current && ref.current.parentElement;
    if (parent) {
      InlineResizeObserver.observe(parent, handleResize);
    }

    return () => {
      clearTimeout(timer);
      const parent = ref.current && ref.current.parentElement;
      if (parent) {
        InlineResizeObserver.unobserve(parent);
      }
    };
  }, [ref]);

  const translateStartColor = (d: any, cfg: any) => {
    if (d.percent.displayNumber === 0 || d.percent.displayNumber === '-' || !d.percent.displayNumber) {
      return {
        status: 'empty',
        color: themeColors['widgets-tooltip-cross-line'],
      };
    } else if (cfg?.guide) {
      const threshold = Number((cfg?.guide?.threshold ?? '80%')?.replace('%', ''));
      if (d.percent.displayNumber >= threshold) {
        return {
          status: cfg?.guide?.status ?? 'error',
          color: statusColors[cfg?.guide?.status ?? 'error'],
        };
      } else {
        return {
          status: Object.keys(statusColors)?.includes(cfg?.startColor) ? cfg?.startColor : 'normal',
          color: statusColors[cfg?.startColor] || cfg?.startColor || themeColors['widgets-color-normal'],
        };
      }
    } else {
      return {
        status: Object.keys(statusColors)?.includes(cfg?.startColor) ? cfg?.startColor : 'normal',
        color: statusColors[cfg?.startColor] || cfg?.startColor || themeColors['widgets-color-normal'],
      };
    }
  };

  return (
    <div
      className={`${pfx}-percent-container`}
      style={{
        width: config?.barSize || '100%',
        ...config?.percentConfig,
      }}
      ref={ref}
    >
      <div className={`${pfx}-bar-container ${translateStartColor(data, config)?.status}`} style={config?.barConfig}>
        {config?.guide && (
          <div
            className={`${pfx}-bar-guide-line ${config?.guide?.status ?? 'error'}`}
            style={{
              height: config?.guide?.threshold ?? '80%',
              borderTopColor: statusColors[config?.guide?.status ?? 'error'],
            }}
          >
            <NumberDisplay
              className={`${pfx}-bar-guide-text ${config?.guide?.status ?? 'error'}`}
              style={{
                color: statusColors[config?.guide?.status ?? 'error'],
              }}
            >
              {config?.guide?.threshold ?? '-'}
            </NumberDisplay>
          </div>
        )}
        <div
          className={`${pfx}-process-bar`}
          style={{
            width: config?.barSize || config?.percentConfig?.width || '100%',
            height:
              data.percent.displayNumber === 0 || data.percent.displayNumber === '-'
                ? '15px'
                : `calc(${data.percent.displayNumber}% + 15px)`,
            ...config?.processBarConfig,
          }}
        >
          <div
            className={`${pfx}-process-back`}
            style={{
              background: `linear-gradient(180deg, transparent 19px, ${translateStartColor(data, config).color} 0%, ${
                config?.endColor || tinycolor(translateStartColor(data, config).color).setAlpha(0.1).toRgbString()
              } 100%)`,
              ...config?.processBarBackConfig,
              transform: `translate3d(${-offsetX}px,0,0) scale(1, 1) perspective(1px)`,
            }}
          >
            <svg className="process-svg" width="100%" height={20} version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <path
                  d={getClipPath(width * 2, 20)}
                  fill={translateStartColor(data, config).color}
                  opacity="0.5"
                  transform={`translate(${-0.5 * width},0)`}
                />
                <path d={getClipPath(width * 2, 20)} fill={translateStartColor(data, config).color} />
              </g>
            </svg>
          </div>
        </div>
        <NumberDisplay
          className={`${pfx}-percent-bar-label-content ${config?.size || 'medium'}`}
          style={config?.labelConfig}
        >
          {data.percent.displayNumber}
          <span className={`${pfx}-percent-bar-label-unit`}>{config?.labelConfig?.unit || '%'}</span>
        </NumberDisplay>
        <div className={`${pfx}-percent-bar-label-title`} style={config?.titleConfig}>
          {data.percent.name}
        </div>
      </div>
    </div>
  );
}

const Wcapacity: React.FC<WcapacityProps> = ({ data, config, height, style }) => {
  useEffect(() => {
    chartLog('Wcapacity', 'init');
  }, []);

  return (
    <div
      className={prefix}
      style={{
        height: height || '100%',
        ...style,
      }}
    >
      <PercentBar config={config} data={data} prefix={prefix} />
    </div>
  );
};

export default Wcapacity;
