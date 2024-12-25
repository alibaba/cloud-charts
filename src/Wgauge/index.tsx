'use strict';

import React, { useState, useEffect, useRef } from 'react';
import { Status } from '../common/types';
import { FullCrossName, PrefixName } from '../constants';
import WidgetsTooltip from '../common/Tooltip';
import { numberDecimal, unitConversion, customFormatterConfig } from '../common/common';
import { GlobalResizeObserver } from '../common/globalResizeObserver';
import './index.scss';

const prefix = `${PrefixName}-wgauge`;

interface IDataWgauge {
  total?: number; // 表盘总数, 默认100
  current: number; // 当前数据
  label?: string; // 表盘文字
}

export interface IWgaugeProps {
  data: IDataWgauge;
  config: WgaugeProps;
}

interface WgaugeProps extends customFormatterConfig {
  colors?: string | Array<[number, Status | string]>;
  percentage?: boolean;
  className?: string;
  outRing?: boolean;
  fontColorFit?: boolean;
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
  angle?: {
    start?: number; // 起始角度，默认x轴负方向
    end?: number; // 结束角度，默认x轴方向
  };
  // colorsType?: 'gradient' | 'single'; // 默认为single(单色)
  // type?: 'solid' | 'dashed'; // 实线仪表盘或虚线仪表盘
  customStyles?: {
    valueStyle?: React.CSSProperties; // 值样式
    textStyle?: React.CSSProperties; // 文字样式
    unitStyle?: React.CSSProperties; // 单位样式
    gaugeTextStyle?: React.CSSProperties; // 刻度文字样式
    gaugeLineStyle?: React.CSSProperties; // 刻度线段样式
    scaleLineLength?: number; //刻度线段的长度
  };
}

const Wgauge: React.FC<IWgaugeProps> = (props) => {
  const { data, config } = props;
  const { total = 100, label } = data;

  const {
    colors = [
      [60, 'error'],
      [80, 'warning'],
      [100, 'success'],
    ],
    fontColorFit = false,
    angle = {
      start: -180, // 默认起始角度（x轴负方向）
      end: 0, // 默认结束角度（x轴方向）
    },
    className = '',
    // decorationGap = config?.angle && config.angle?.end - config.angle?.start > 180 ? 0 : 22,
    decorationStrokeWidth = config?.angle && config.angle?.end - config.angle?.start > 180 ? 0 : 4,
    outRing = true,
    gaugeScale = false,
    percentage = true,
    unit = '',
    customStyles = {},
    needUnitTransform,
    valueType,
    decimal,
    unitTransformTo,
  } = config || {};

  let sourceValue = data.current > 100 ? 100 : data.current < 0 ? 0 : data.current;
  let current = percentage ? (sourceValue / total) * 100 : sourceValue;

  let finalUnit = percentage ? '%' : unit;

  if (needUnitTransform && (unit || valueType)) {
    if (valueType === 'percent_1') {
      current = current * 100;
    }

    const { value, unit: transformUnit } = unitConversion(
      current,
      finalUnit,
      decimal,
      unitTransformTo,
      valueType,
    );

    current = value;
    finalUnit = transformUnit;
  } else {
    current = numberDecimal(current, decimal);
  }

  const {
    textStyle = {},
    valueStyle = {},
    unitStyle = {},
    gaugeTextStyle = {},
    gaugeLineStyle = {},
    scaleLineLength = gaugeScale !== false ? 10 : 0,
  } = customStyles;
  const labelRef = useRef<HTMLDivElement>(null);
  // 获取用户自定义刻度样式时的字体大小
  const [gaugeScaleFlag, setGaugeScaleFlag] = useState(false);
  const [realScaleLineLength, setRealScaleLineLength] = useState(scaleLineLength);
  // 当半径小于50时，取消掉外圈刻度，否则取用户自定义字体大小，如果没有设置，则看用户是否启用刻度，启用的话默认12
  const gaugeTextSize = gaugeScaleFlag
    ? 0
    : getFontSizeNumber(gaugeTextStyle) === 0
    ? gaugeScale
      ? 12
      : 0
    : getFontSizeNumber(gaugeTextStyle);
  const { scaleNum = 5, scale = true } =
    typeof gaugeScale === 'object' && gaugeScale !== null
      ? gaugeScale
      : { scaleNum: 0, scale: false };

  const containerRef = useRef(null); // 用于引用父容器的ref
  const [radius, setRadius] = useState(100); // 默认半径为100，实际会基于父元素高度来调整
  const strokeWidth = radius * 0.12 < 12 ? 12 : radius * 0.12;
  const decorationGap =
    config?.angle && config.angle?.end - config.angle?.start > 180 ? 0 : outRing ? strokeWidth : 0;
  const [lineSize, setLineSize] = useState(100 * 0.8 * 0.24);
  const [gap, setGap] = useState(0);
  const textRef = useRef(null);
  const [flag, setFlag] = useState(false);
  const strokeColor = Array.isArray(colors)
    ? `var(--${prefix}-${getColorForCurrent(current, total, colors)}-color)`
    : `var(--${prefix}-${colors}-color)`;

  useEffect(() => {
    // 确定父元素的高度，并据此更新半径
    let timer: any;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!containerRef.current) return;
        const height = containerRef.current.clientHeight || 200;
        const width = containerRef.current.clientWidth;
        // 当用宽度的一半做半径时设置flag用于调整文字样式
        if (width < height * 2) {
          setFlag(true);
        } else {
          setFlag(false);
        }
        const realradius = width < height * 2 ? width / 2 : height;
        const strokeWidth = realradius * 0.12 < 12 ? 12 : realradius * 0.12;
        const decorationGap =
          config?.angle && config.angle?.end - config.angle?.start > 180
            ? 0
            : outRing
            ? strokeWidth
            : 0;
        const scaleHeight = gaugeScaleFlag && width < height * 2 ? decorationStrokeWidth * 2 : 0;
        // 圆的半径需要考虑strokeWidth的影响，以便圆完全显示在父元素内
        // setGap(height - (realradius - strokeWidth - decorationGap - decorationStrokeWidth - scaleHeight));
        setRadius(realradius - strokeWidth - decorationGap - decorationStrokeWidth - scaleHeight);
        setLineSize(realradius * 0.8 * 0.24);
      }, 0);
    };

    handleResize();

    const parent = containerRef.current && containerRef.current.parentElement;
    if (parent) {
      GlobalResizeObserver.observe(parent, handleResize);
    }

    return () => {
      clearTimeout(timer);

      const parent = containerRef.current && containerRef.current.parentElement;
      if (parent) {
        GlobalResizeObserver.unobserve(parent);
      }
    };
  }, [containerRef]);

  useEffect(() => {
    if (radius < 40) {
      setGaugeScaleFlag(true);
      setRealScaleLineLength(0);
    } else {
      setGaugeScaleFlag(false);
      setRealScaleLineLength(scaleLineLength);
    }
  }, [radius]);

  // 计算弧度的起始角和结束角
  const startAngle = angle.start;
  const endAngle = startAngle + (current / total) * (angle.end - angle.start);
  const bottomEnd = angle.end;

  // 计算起始点和结束点坐标
  const { x: startX, y: startY } = calculatePositionOnCircle(startAngle, radius);
  const { x: endX, y: endY } = calculatePositionOnCircle(endAngle, radius);
  const { x: bottomEndX, y: bottomEndY } = calculatePositionOnCircle(bottomEnd, radius);

  // 根据圆弧长短设置 largeArcFlag
  const largeArcFlag = angle.end - angle.start > 180 ? 1 : 0;
  const dataArcFlag = (current / total) * (angle.end - angle.start) > 180 ? 1 : 0;

  const { x: decoratedStartX, y: decoratedStartY } = calculatePositionOnCircle(
    startAngle,
    radius,
    decorationGap,
  );
  const { x: decoratedEndX, y: decoratedEndY } = calculatePositionOnCircle(
    bottomEnd,
    radius,
    decorationGap,
  );

  // 仪表盘装饰圆环
  const pathRingData = [
    `M ${decoratedStartX} ${decoratedStartY}`, // 移动到装饰性弧线的起点
    `A ${radius + decorationGap} ${
      radius + decorationGap
    } 0 ${largeArcFlag} 1 ${decoratedEndX} ${decoratedEndY}`,
    // `A ${radius + decorationGap} ${radius + decorationGap} 0 0 1 ${decoratedStartX} ${decoratedStartY}`,
  ].join(' ');

  // 仪表盘圆环
  const pathData = [
    `M ${startX} ${startY}`, // 移动到起点
    `A ${radius} ${radius} 0 ${dataArcFlag} 1 ${endX} ${endY}`,
  ].join(' ');

  // 底纹
  const pathBottomData = [
    `M ${startX} ${startY}`, // 移动到起点
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${bottomEndX} ${bottomEndY}`,
    // `A ${radius} ${radius} 0 0 1 ${startX} ${startY}`,
  ].join(' ');

  const renderNum = () => {
    const { lineHeight, fontSize } = valueStyle;

    return (
      <div className={`${prefix}-value-wrapper`}>
        <div
          className={`${prefix}-num`}
          style={{
            fontSize: fontSize ? fontSize : lineSize,
            lineHeight: lineHeight ? lineHeight : `${lineSize}px`,
          }}
        >
          {current}
        </div>
        <div
          style={{
            fontSize: fontSize ? fontSize : lineSize * 0.7,
            lineHeight: lineHeight ? lineHeight : `${lineSize * 0.7}px`,
            ...unitStyle,
          }}
          className={`${prefix}-unit`}
        >
          {finalUnit}
        </div>
      </div>
    );
  };

  // strokeWidth：24，decorationGap：22，decorationStrokeWidth：4
  const viewBoxDecoratedX = -strokeWidth / 2 - decorationGap - decorationStrokeWidth / 2;
  const viewBoxDecoratedY = -strokeWidth / 2 - decorationGap - decorationStrokeWidth / 2;
  const viewBoxWidthWithDecorations =
    2 * radius + strokeWidth + 2 * (decorationGap + decorationStrokeWidth);
  const viewBoxHeightWithDecorations =
    radius + strokeWidth + decorationGap + decorationStrokeWidth > 50
      ? config?.angle && config.angle?.end - config.angle?.start > 180
        ? radius + strokeWidth + decorationGap + decorationStrokeWidth
        : radius + 2 * strokeWidth + decorationGap + decorationStrokeWidth
      : 50;

  const tickArr = new Array(scaleNum).fill(0).map((item, idx: number) => {
    return numberDecimal(0 + (idx * 100) / (scaleNum - 1));
  });

  const tickMarks = tickArr.map((value: number, index: number) => {
    // 根据圆环划分段数，计算对应的角度
    let angleValue = angle.start + ((angle.end - angle.start) * value) / 100;
    const textOffset =
      angle.end - angle.start > 180 ? strokeWidth : decorationGap + decorationStrokeWidth;
    const innerPos = calculatePositionOnCircle(angleValue, radius, textOffset);
    const outerPos = calculatePositionOnCircle(
      angleValue,
      radius,
      textOffset + realScaleLineLength,
    );
    if (value === 0 || value === 100) {
      innerPos.y -= 1;
      outerPos.y -= 1;
    }
    const textPos = calculatePositionOnCircle(
      angleValue,
      radius,
      textOffset + realScaleLineLength * (scale ? 2 : 1) + gaugeTextSize / 3,
    );

    const renderText = (
      <text
        x={textPos.x}
        y={textPos.y}
        className={
          angle.end - angle.start > 180 ? `${prefix}-scale-num-big` : `${prefix}-scale-num`
        }
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
        {scaleNum > 8
          ? scaleNum % 2 !== 0
            ? index % 2 === 0 && renderText
            : renderText
          : renderText}
      </>
    );
  });

  const textOffset = viewBoxHeightWithDecorations - startY + viewBoxDecoratedY - gaugeTextSize / 3;

  const viewBox =
    angle.end - angle.start > 180
      ? `${viewBoxDecoratedX} ${
          viewBoxDecoratedY - strokeWidth - gaugeTextSize * 2 - realScaleLineLength
        } ${viewBoxWidthWithDecorations} ${
          viewBoxHeightWithDecorations +
          Math.cos(((angle.start - 180) * Math.PI) / 180) *
            (radius + gaugeTextSize + realScaleLineLength) +
          gaugeTextSize +
          realScaleLineLength * 2
        }`
      : `${viewBoxDecoratedX - realScaleLineLength * 2 - gaugeTextSize - 2} ${
          viewBoxDecoratedY - strokeWidth / 3
        } ${viewBoxWidthWithDecorations + realScaleLineLength * 4 + gaugeTextSize * 2} ${
          viewBoxHeightWithDecorations - realScaleLineLength * 2 - gaugeTextSize
        }`;

  return (
    <div
      ref={containerRef}
      style={{
        alignItems: angle.end - angle.start > 180 ? 'center' : 'end',
      }}
      className={`${FullCrossName} ${prefix}-container`}
    >
      <svg
        className={`${prefix}-svg`}
        width={viewBoxWidthWithDecorations}
        height={viewBoxHeightWithDecorations}
        viewBox={viewBox}
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
        {outRing && angle.end - angle.start <= 180 && (
          <path
            d={pathRingData}
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth={decorationStrokeWidth}
          />
        )}
        <path
          d={pathBottomData}
          fill="none"
          className={`${prefix}-path`}
          strokeWidth={strokeWidth}
        />
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} />
        {!gaugeScaleFlag ? tickMarks : <></>}
      </svg>
      <div
        ref={textRef}
        className={`${prefix}-text ${gaugeScale || flag ? prefix + '-scale' : ''} ${
          flag && angle.end - angle.start <= 180 ? prefix + '-width-scale' : ''
        }`}
        style={{
          transform:
            angle.end - angle.start > 180 ? `translateY(50%)` : `translateY(-${textOffset}px)`,
          color: fontColorFit && strokeColor,
        }}
      >
        {renderNum()}
        <div
          className={`${prefix}-label`}
          ref={labelRef}
          style={{
            maxWidth: `${radius}px`,
            color: fontColorFit && strokeColor,
            ...textStyle,
          }}
          title={label}
        >
          {label}
        </div>
        <WidgetsTooltip ref={labelRef} content={label || ''} />
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

function getColorForCurrent(
  current: number,
  total: number,
  colors: Array<[number, Status | string]>,
) {
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
    return parseInt(style.fontSize as string, 10) <= 12
      ? 0
      : parseInt(style.fontSize as string, 10);
  }
  return 0;
}

export default Wgauge;
