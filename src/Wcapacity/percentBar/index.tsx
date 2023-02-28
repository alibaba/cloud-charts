import React, { useRef, useEffect, useState } from 'react';
import { IProps } from '../interface';
import themes from '../../themes/index';
import Wnumber from '../../Wnumber';
import './index.scss';

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

function PercentBar(props: IProps) {
  const { data, config } = props;
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let timer: any;

    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!ref.current) return;
        const waterWidth = ref?.current?.clientWidth ?? 0;
        setWidth(waterWidth);
      }, 0);
    };

    handleResize();

    window.addEventListener('resize', handleResize, false);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize, false);
    };
  }, [ref]);

  const statusColors: any = {
    normal: themes['widgets-capacity-color-grey'],
    success: themes['widgets-color-green'],
    warning: themes['widgets-color-orange'],
    error: themes['widgets-color-red'],
  };

  return (
    <div
      className="percent-container"
      style={{
        width: config.barSize || 200,
        ...config.percentConfig
      }}
      ref={ref}
    >
      <div className="bar-container" style={config.barConfig}>
        {config?.guide && (
          <div
            className="bar-guide-line"
            style={{
              height: config.guide?.threshold ?? '80%',
              borderTopColor: statusColors[config.guide?.status ?? 'normal'],
            }}
          >
            <Wnumber
              className="bar-guide-text"
              style={{
                color: statusColors[config.guide?.status ?? 'normal'],
              }}
            >
              {config.guide?.threshold ?? '-'}
            </Wnumber>
          </div>
        )}
        <div
          className="process-bar"
          style={{
            width: config.barSize || config?.percentConfig?.width || 200,
            height: data.percent.displayNumber === 0 ? '15px' : `${data.percent.displayNumber}%`,
            ...config.processBarConfig,
          }}
        >
          <div
            className="process-back"
            style={{
              background: `linear-gradient(180deg, transparent 19px, ${data.percent.displayNumber === 0 ? themes['widgets-tooltip-cross-line'] : statusColors[config.startColor] || config.startColor || themes['widgets-color-category-1']} 0%, ${
                config.endColor || 'rgba(0,0,0,0)'
              } 100%)`,
              ...config.processBarBackConfig,
            }}
          >
            <svg className="process-svg" width="100%" height={20} version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <path
                  d={getClipPath(width * 2, 20)}
                  fill={data.percent.displayNumber === 0 ? themes['widgets-tooltip-cross-line'] : statusColors[config.startColor] || config.startColor || themes['widgets-color-category-1']}
                  opacity="0.5"
                  transform={`translate(${-0.5 * width},0)`}
                />
                <path d={getClipPath(width * 2, 20)} fill={data.percent.displayNumber === 0 ? themes['widgets-tooltip-cross-line'] : statusColors[config.startColor] || config.startColor || themes['widgets-color-category-1']} />
              </g>
            </svg>
          </div>
        </div>
        <Wnumber
          className="percent-bar-label-content"
          style={config.labelConfig}
        >
          {data.percent.displayNumber}
          <span className="percent-bar-label-unit">{config?.labelConfig?.unit || '%'}</span>
        </Wnumber>
        <div
          className="percent-bar-label-title"
          style={config.titleConfig}
        >
          {data.percent.name}
        </div>
      </div>
    </div>
  );
}

export default PercentBar;