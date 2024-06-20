'use strict';

import React, { useState, useEffect, useRef } from 'react';
import { Status } from '../common/types';
import { FullCrossName, PrefixName } from '../constants';
import { numberDecimal } from '../common/common';
import './index.scss';

const prefix = `${PrefixName}-wgauge`;

interface IDataWgauge {
  total?: number; // 表盘总数, 默认100
  current: number; // 当前数据
}

export interface IWgaugeProps {
  data: IDataWgauge;
  config: WgaugeProps;
}

interface WgaugeProps {
  colors?: string | Array<[number, Status | string]>;
  percentage?: boolean;
  className?: string;
  outRing?: boolean;
  strokeWidth?: number; // 圆环宽度
  decorationGap?: number; // 装饰性弧线与原弧线之间的间隔
  decorationStrokeWidth?: number; // 装饰性弧线的宽度
  // todo
  // | {
  //   breakpoint?: number[]; // 外圈断点
  // }; // 当显示外圈时，gaugeScale.show 为false, 默认为true;
  // gaugeScale?: boolean;
  gaugeScale?:
    | boolean
    | {
        scaleNum?: number; // 数字段数, 默认为5（0，25，50，75，100）
        scale?: boolean; // 是否显示仪表盘指针刻度，段数与scaleNum相同，大段中间有一小段
      }; // 默认为false，不展示数字及刻度
  unit?: string;
  // todo
  // angle?: {
  //   start?: number; // 起始角度，默认x轴负方向
  //   end?: number; // 结束角度，默认x轴方向
  // };
  // colorsType?: 'gradient' | 'single'; // 默认为single(单色)
  // type?: 'solid' | 'dashed'; // 实线仪表盘或虚线仪表盘
  customStyles?: {
    textStyle?: React.CSSProperties; // 文字样式
    unitStyle?: React.CSSProperties; // 单位样式
    gaugeTextStyle?: React.CSSProperties; // 刻度文字样式
    gaugeLineStyle?: React.CSSProperties; // 刻度线段样式
    scaleLineLength?: number; //刻度线段的长度
  };
}

const Wgauge: React.FC<IWgaugeProps> = (props) => {
  const { data, config } = props;
  const { current, total = 100 } = data;
  const {
    colors = [
      [60, 'error'],
      [80, 'warning'],
      [100, 'success'],
    ],
    className = '',
    strokeWidth = 24,
    decorationGap = 22,
    decorationStrokeWidth = 4,
    outRing = true,
    gaugeScale = false,
    percentage = true,
    unit = '',
    customStyles = {},
  } = config || {};
  const {
    textStyle = {},
    unitStyle = {},
    gaugeTextStyle = {},
    gaugeLineStyle = {},
    scaleLineLength = gaugeScale !== false ? 10 : 0,
  } = customStyles;
  // 获取用户自定义刻度样式时的字体大小
  const gaugeTextSize = getFontSizeNumber(gaugeTextStyle);
  const {
    scaleNum = 5,
    scale = true,
  } = typeof gaugeScale === 'object' && gaugeScale !== null
    ? gaugeScale
    : { scaleNum: 0, scale: false };

  const containerRef = useRef(null); // 用于引用父容器的ref
  const [radius, setRadius] = useState(100); // 默认半径为100，实际会基于父元素高度来调整
  const elementRef = useRef(null);
  const [flag, setFlag] = useState(false);
  const [gauleOffset, setGauleOffset] = useState(0);
  const strokeColor = Array.isArray(colors)
    ? `var(--${prefix}-${getColorForCurrent(current, total, colors)}-color)`
    : `var(--${prefix}-${colors}-color)`;

  useEffect(() => {
    if (elementRef.current) {
      const numOffset =
        parseFloat(window.getComputedStyle(elementRef.current.lastElementChild).width) + decorationStrokeWidth;
      setGauleOffset(numOffset);
    }
  }, []);

  useEffect(() => {
    // 确定父元素的高度，并据此更新半径
    if (containerRef.current) {
      const height = containerRef.current.getBoundingClientRect().height || 200;
      const width = containerRef.current.getBoundingClientRect().width;
      // 当用宽度的一半做半径时设置flag用于调整文字样式
      if (width < height * 2) {
        setFlag(true);
      }
      const realradius = width < height * 2 ? width / 2 : height;
      const scaleHeight = gaugeScale
        ? width < height * 2
          ? decorationStrokeWidth * 2
          : gauleOffset + decorationStrokeWidth * 2
        : 0;
      // 圆的半径需要考虑strokeWidth的影响，以便圆完全显示在父元素内
      setRadius(realradius - strokeWidth - decorationGap - decorationStrokeWidth - scaleHeight);
    }
  }, [containerRef]);

  const circumference = Math.PI * radius;
  const halfCircumference = circumference / 2;
  let arcLength = (current / total) * halfCircumference;

  // 计算弧度的起始角和结束角
  const startAngle = -180;
  const endAngle = startAngle + (arcLength / halfCircumference) * 180;

  // 计算起始点和结束点坐标
  const { x: startX, y: startY } = calculatePositionOnCircle(startAngle, radius);
  const { x: endX, y: endY } = calculatePositionOnCircle(endAngle, radius);

  // 根据圆弧长短设置 largeArcFlag
  const largeArcFlag = arcLength > halfCircumference ? 1 : 0;

  const { x: decoratedStartX, y: decoratedStartY } = calculatePositionOnCircle(startAngle, radius, decorationGap);

  // 仪表盘装饰圆环
  const pathRingData = [
    `M ${decoratedStartX} ${decoratedStartY}`, // 移动到装饰性弧线的起点
    `A ${radius + decorationGap} ${radius + decorationGap} 0 ${largeArcFlag} 1 ${radius * 2 + decorationGap} ${radius}`,
  ].join(' ');

  // 仪表盘圆环
  const pathData = [
    `M ${startX} ${startY}`, // 移动到起点
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
  ].join(' ');

  // 底纹
  const pathBottomData = [
    `M ${startX} ${startY}`, // 移动到起点
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${radius * 2} ${radius}`,
  ].join(' ');

  const renderNum = () => {
    if (percentage) {
      return (
        <>
          <div className={`${prefix}-num`}>{numberDecimal((current / total) * 100)}</div>
          <div style={unitStyle} className={`${prefix}-unit`}>
            %
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className={`${prefix}-num`}>{numberDecimal(current)}</div>
          <div style={unitStyle} className={`${prefix}-unit`}>
            {unit}
          </div>
        </>
      );
    }
  };

  const viewBoxDecoratedX = -strokeWidth / 2 - decorationGap - decorationStrokeWidth / 2;
  const viewBoxDecoratedY = -strokeWidth / 2 - decorationGap - decorationStrokeWidth / 2;
  const viewBoxWidthWithDecorations = 2 * radius + strokeWidth + 2 * (decorationGap + decorationStrokeWidth);
  const viewBoxHeightWithDecorations =
    radius + strokeWidth / 2 + (strokeWidth / 2) * (startY <= radius ? 1 : -1) + decorationGap + decorationStrokeWidth;

  const tickArr = new Array(scaleNum).fill(0).map((item, idx: number) => {
    return numberDecimal(0 + (idx * 100) / (scaleNum - 1));
  });

  const tickMarks = tickArr.map((value: number, index: number) => {
    // 根据圆环划分段数，计算对应的角度
    let angle = -180 / (100 / (100 - value));
    const innerPos = calculatePositionOnCircle(angle, radius, decorationGap + decorationStrokeWidth);
    const outerPos = calculatePositionOnCircle(angle, radius, decorationGap + decorationStrokeWidth + scaleLineLength);
    if (value === 0 || value === 100) {
      innerPos.y -= 1;
      outerPos.y -= 1;
    }
    const textPos = calculatePositionOnCircle(
      angle,
      radius,
      decorationGap + decorationStrokeWidth * 2 + scaleLineLength * (scale ? 2 : 1) + gaugeTextSize / 3,
    );

    const renderText = (
      <text
        x={textPos.x}
        y={textPos.y}
        className={`${prefix}-scale-num`}
        style={gaugeTextStyle}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {value}
      </text>
    );

    return (
      <>
        {scale && (
          <line
            key={index}
            x1={innerPos.x}
            y1={innerPos.y}
            x2={outerPos.x}
            y2={outerPos.y}
            style={gaugeLineStyle}
            className={`${prefix}-scale`}
          />
        )}
        {/* 当仪表盘段数不超过8时，显示全部刻度线 */}
        {/* 当段数超过8，且分段数为偶数（即scaleNum 为奇数时刻度线有间隔，偶数则都展示出来*/}
        {scaleNum > 8 ? (scaleNum % 2 !== 0 ? index % 2 === 0 && renderText : renderText) : renderText}
      </>
    );
  });

  return (
    <div ref={containerRef} className={`${FullCrossName} ${prefix}-container`}>
      <svg
        className={`${prefix}-svg`}
        width={viewBoxWidthWithDecorations}
        height={'100%'}
        viewBox={`${viewBoxDecoratedX - scaleLineLength * 2 - gaugeTextSize} ${viewBoxDecoratedY} ${
          viewBoxWidthWithDecorations + scaleLineLength * 4 + gaugeTextSize * 2
        } ${viewBoxHeightWithDecorations - scaleLineLength * 2}`}
      >
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            {Array.isArray(colors) &&
              colors.map(([offset, colorName]) => {
                return (
                  <stop
                    key={colorName}
                    offset={`${(offset / total) * 100}%`}
                    stopColor={`var(--${prefix}-${colorName}-color)`}
                  />
                );
              })}
          </linearGradient>
        </defs>
        {outRing && <path d={pathRingData} fill="none" stroke="url(#gradient1)" strokeWidth={decorationStrokeWidth} />}
        <path d={pathBottomData} fill="none" className={`${prefix}-path`} strokeWidth={strokeWidth} />
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
        {gaugeScale && tickMarks}
      </svg>
      <div
        className={`${prefix}-text ${gaugeScale || flag ? prefix + '-scale' : ''} ${
          flag ? prefix + '-width-scale' : ''
        }`}
        style={{
          ...textStyle,
          transform: `translate(-50%, calc(-50% - ${
            flag ? 'var(--font-size-small) - var(--font-size-big)' : 'var(--font-size-big)'
          } - ${gaugeTextSize / 3}px ))`,
        }}
      >
        {renderNum()}
      </div>
    </div>
  );
};

function calculatePositionOnCircle(angle: number, radius: number, offset: number = 0) {
  const radians = (angle * Math.PI) / 180;
  const x = radius + (radius + offset) * Math.cos(radians);
  const y = radius + (radius + offset) * Math.sin(radians);
  return { x, y };
}

function getColorForCurrent(current: number, total: number, colors: Array<[number, Status | string]>) {
  for (let i = 0; i < colors.length; i++) {
    const [threshold, colorName] = colors[i];
    if (current <= threshold) {
      return colorName;
    }
  }
  return colors[colors.length - 1][1];
}

function getFontSizeNumber(style: React.CSSProperties) {
  if (style && style.hasOwnProperty('fontSize')) {
    return parseInt(style.fontSize as string, 10) <= 12 ? 0 : parseInt(style.fontSize as string, 10);
  }
  return 0;
}

export default Wgauge;
