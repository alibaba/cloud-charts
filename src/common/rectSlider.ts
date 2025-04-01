'use strict';

import { Chart, Types, G2Dependents } from './types';
import themes from '../themes';
import { FullCrossName } from '../constants';
import { merge, sampleDataWithNoise, numberDecimal, getStatusColor, deepAssign } from './common';
import { calcTextWidth } from './ellipsisLabel';
import './index.scss';

interface Slider extends Types.SliderCfg {
  /** 显示边界值，默认 false */
  showText?: boolean;
  labelFormatter?(val: any, datum: Types.Datum, idx: number): any;
  sampleRate?: number;
  type: 'simple' | 'normal' | 'default';
}

export interface SliderConfig {
  slider?: Slider | boolean;
}

/**
 * 直角坐标系的缩略轴设置
 *
 * @param {Chart} chart 图表实例
 * @param {SliderConfig} config 配置项
 * */
export default function (chart: Chart, config: SliderConfig) {
  if (!config.slider) {
    return;
  }

  // 更新图例和缩略轴的位置
  const defaultConfig: Slider = {
    // 由于内部对 trendCfg 使用浅层合并，在主题包中配置会被覆盖，只能在这一层设置。
    trendCfg: {
      lineStyle: {
        stroke: themes['widgets-slider-trend-bg'],
        opacity: 0.1,
      },
      areaStyle: {
        fill: themes['widgets-slider-trend-bg'],
        opacity: themes['widgets-slider-trend-opacity'],
      },
      smooth: false,
      isArea: true,
      data: [],
    } as G2Dependents.TrendCfg,
    backgroundStyle: {
      fill: `${themes['widgets-color-container-background']}10`,
      stroke: `${themes['widgets-slider-trend-border-color']}80`,
      opacity: 1,
    },
    textStyle: {},
    start: 0.64,
    end: 1,
    handlerStyle: {
      width: 3,
      radius: 0,
      // stroke: themes['widgets-slider-handler-border-color'],
      fill: themes['widgets-color-background'],
      style: {},
    },
    type: 'simple',
    sampleRate: 1,
    // formatter: (value, datum, idx) => {
    //   console.log(value, datum, idx)
    //   return value;
    // },
  };

  const {
    showText = false,
    labelFormatter = undefined,
    ...other
  } = typeof config.slider === 'object' ? deepAssign({}, defaultConfig, config.slider) : deepAssign({}, defaultConfig);
  const { sampleRate, type } = other;

  // 获取数据
  const { data: viewData } = chart?.getOptions() ?? {};
  let _sampleRate: number = sampleRate;

  if (showText) {
    defaultConfig.textStyle.opacity = 0.8;
  }

  if (labelFormatter) {
    defaultConfig.formatter = labelFormatter;
  }

  // 目前只显示第一组数据
  // 默认为第一组数据，后面希望可以通过图例点击交互
  const firstType = viewData?.[0]?.type ?? [];
  const dataCount = viewData?.length ?? 0;
  // 获取标记数据喝状态
  let markData: any = [];
  let maxValue = -Infinity;
  const filterDataArray = viewData
    .filter((el: any) => firstType === el.type)
    ?.map((el: any, index: number) => {
      maxValue = Math.max(maxValue, Number(el.y));
      const filterData = el.extra?.filter((subExtra: any) => subExtra.status);
      if (el.extra && filterData?.length) {
        markData.push({
          ...el,
          markerOptions: filterData[0],
          index,
        });
      }
      return numberDecimal(el.y) ?? null;
    });

  // 对数据进行采样，尽量保留噪声数据
  // 宽高有误差，实际需要减去间距
  const { width: viewWidth } = chart?.coordinateBBox;
  // 获取Y轴最大文本长度
  const maxTextLength = calcTextWidth(maxValue?.toString());
  const adjustDistance = viewWidth > maxTextLength ? maxTextLength : 0;
  const adjustWidth = viewWidth - adjustDistance;

  // 根据密度生成采样率
  const density = adjustWidth / dataCount;

  if (density > 1) {
    _sampleRate = 1;
  } else {
    _sampleRate = density;
  }

  // 通过数据判断是否有标记点
  if (markData?.length) {
    // console.log(viewData, markData);
    markData.forEach((subMark: any) => {
      const relativeRate = subMark.index / dataCount;
      const relativeWidth = relativeRate * adjustWidth * _sampleRate;
      // console.log('relativeRate', _sampleRate, relativeRate, relativeWidth, adjustWidth);

      if (type === 'normal') {
        chart.annotation().html({
          // container: '',
          html: `<div class='${FullCrossName} slider-marker-container' style="height: 26px; background:${getStatusColor(
            subMark?.markerOptions?.status,
          )};" title="查看标记点"></div>`,
          position: ['0%', '100%'],
          // 可以写死是根据规范的间距设定的
          offsetY: 60,
          offsetX: relativeWidth,
        });
      }
    });
  }

  // console.log(viewWidth, viewHeight, dataCount, density)

  const sampledData = sampleDataWithNoise(filterDataArray, _sampleRate);
  // console.log(viewData, filterDataArray, sampledData)

  // 如果有NULL值，G2的slider会默认相连
  const sliderConfig = merge(defaultConfig, other, {
    trendCfg: {
      data: sampledData,
    },
  });
  // console.log("slider", sliderConfig, chart?.getOptions())

  chart.option('slider', sliderConfig);
}
