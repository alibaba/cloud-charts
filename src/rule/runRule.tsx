import { calcDataSize } from './data';
import { EmptyDataProcess, isEmptyData, processEmptyData } from './emptyData';
import { merge } from '../common/common';
import themes from '../themes/index';
import { getText } from '../ChartProvider';
import { isBigDataInit } from './bigData';
import { classifyChart } from './classification';
import { PrefixName } from '../constants';
import ReactDOM from 'react-dom';
import React from 'react';

/** 图表初始化时运行的规则 */
export function runInitRule(chartObj: any, config: any, data: any) {
  const { chartName } = chartObj;

  // 1.图表分类，读取该图表所有规则
  // 部分子类有与父类不同的规则，需要合并
  const chartRule = classifyChart(chartName, data, config);
  if (!chartRule) {
    // console.log(chartName, '没有规则映射');
    return {};
  }
  chartObj.chartRule = chartRule;

  // chartObj.errorInfo = '';

  let showEmptyChart = false;

  // loading状态，与空状态调用同样的规则
  if (chartObj?.props?.loading) {
    showEmptyChart = true;
  }
  // 数据结构检查
  // else if (!checkData(chartRule.dataStructure, data)) {
  //   chartObj.errorInfo = getText('error', chartObj.props?.language || chartObj.context.language, chartObj.context.locale);
  //   showEmptyChart = true;
  // }
  // error状态
  else if (chartObj.props?.errorInfo) {
    showEmptyChart = true;
  } else {
    // 2.计算数据量
    const dataSize = calcDataSize(chartRule.dataStructure, data);
    chartObj.dataSize = dataSize;
    // 3.空数据处理
    if (isEmptyData(dataSize)) {
      chartObj.isEmpty = true;
      showEmptyChart = true;
    } else {
      chartObj.isEmpty = false;
    }
  }

  // loading、error、空数据状态，进行相同操作
  if (showEmptyChart) {
    const { data: emptyReplaceData, config: emptyReplaceConfig } = processEmptyData(
      chartRule.emptyData,
      chartRule.dataStructure,
      chartName,
    );
    // if (!emptyReplaceData && !emptyReplaceConfig) {
    //   console.log(chartName, '没有空数据处理');
    // }
    const newConfig = merge({}, config, emptyReplaceConfig);
    // 双y轴配置项特殊处理
    if (Array.isArray(config?.yAxis) && emptyReplaceConfig?.yAxis) {
      newConfig.yAxis = emptyReplaceConfig?.yAxis;
    }
    // error状态的颜色特殊处理
    if (chartObj?.props?.errorInfo && emptyReplaceConfig?.colors) {
      newConfig.colors = themes['widgets-color-layout-background'];
    }
    return {
      data: emptyReplaceData,
      config: newConfig,
    };
  }

  // 4.大数据处理
  if (
    isBigDataInit(
      chartRule?.name,
      chartRule?.bigData?.judgements,
      chartObj.dataSize,
      chartObj.size[0],
      chartObj.size[1],
      chartRule.mainAxis,
    )
  ) {
    chartObj.isBigData = true;

    if (chartRule?.bigData?.process) {
      const { data: bigReplaceData, config: bigDataConfig } = chartRule?.bigData?.process?.(chartObj, data);

      return {
        data: bigReplaceData,
        config: merge({}, config, bigDataConfig),
      };
    }
  } else {
    chartObj.isBigData = false;
  }

  // 5.极端数据处理
  if (chartRule.extremeData) {
    const extremeProcess = chartRule.extremeData;
    const {
      isExtreme,
      config: extremeReplaceConfig,
      data: extremeReplaceData,
    } = extremeProcess?.(chartObj, config, data);
    if (isExtreme) {
      chartObj.isExtreme = true;
      return {
        data: extremeReplaceData,
        config: merge({}, config, extremeReplaceConfig),
      };
    } else {
      chartObj.isExtreme = false;
    }
  }

  return {};
}

/** 图表绘制前运行的规则 */
export function runBeforePaintRule(chartObj: any, config: any, data: any) {
  if (!chartObj.chartRule) {
    return;
  }
  // 状态：error > loading > empty
  // error
  if (chartObj?.props?.errorInfo && !chartObj.props.children) {
    // 设置背景色
    if (chartObj.chartRule.emptyData === EmptyDataProcess.Background) {
      chartObj.chartDom.style.backgroundColor = themes['widgets-color-layout-background'];
    }
    // 加错误提示
    const element = document.createElement('div');
    ReactDOM.render(chartObj.props?.errorInfo, element);

    chartObj.chart.annotation().html({
      html: element,
      alignX: 'middle',
      alignY: 'middle',
      position: ['50%', '50%'],
    });
  }
  // loading
  else if (chartObj?.props?.loading && !chartObj.props.children) {
    // 设置背景色
    if (chartObj.chartRule.emptyData === EmptyDataProcess.Background) {
      chartObj.chartDom.style.backgroundColor = themes['widgets-color-layout-background'];
    }

    // 加loading提示
    const element = document.createElement('div');
    const prefix = `${PrefixName}-wplaceholder-loading`;
    const loadingElement =
      chartObj.props?.loadingInfo ??
      (chartObj.props?.stateType === 'ai' ? (
        <div className={`${prefix}`} style={{ background: 'none', transform: 'translateX(-50%)' }}>
          <div className={`${prefix}-right-tip`}>
            <svg
              fill="none"
              width="39.999942779541016"
              height="39.999942779541016"
              viewBox="0 0 39.999942779541016 39.999942779541016"
            >
              <defs>
                <clipPath id="master_svg0_1100_009994">
                  <rect x="0" y="0" width="39.999942779541016" height="39.999942779541016" rx="0" />
                </clipPath>
                <linearGradient x1="0" y1="1" x2="1" y2="0" id="master_svg1_855_055841">
                  <stop offset="0%" stop-color="#007EED" stop-opacity="1" />
                  <stop offset="99.28571581840515%" stop-color="#B36CE6" stop-opacity="1" />
                </linearGradient>
                <linearGradient x1="0" y1="1" x2="1" y2="0" id="master_svg2_855_055841">
                  <stop offset="0%" stop-color="#007EED" stop-opacity="1" />
                  <stop offset="99.28571581840515%" stop-color="#B36CE6" stop-opacity="1" />
                </linearGradient>
                <linearGradient x1="0" y1="1" x2="1" y2="0" id="master_svg3_855_055841">
                  <stop offset="0%" stop-color="#007EED" stop-opacity="1" />
                  <stop offset="99.28571581840515%" stop-color="#B36CE6" stop-opacity="1" />
                </linearGradient>
              </defs>
              <g clip-path="url(#master_svg0_1100_009994)">
                <g style={{ opacity: 0.4 }}>
                  <path
                    d="M20.154400000000003,5.0236888C20.3004,5.0723323,20.413899999999998,5.185834,20.4625,5.331764L23.7572,15.2161C23.9186,15.7008,24.2989,16.081200000000003,24.7836,16.2425L34.6679,19.537300000000002C34.8662,19.6037,35,19.7894,35,19.9986C35,20.2078,34.8662,20.3935,34.6679,20.459899999999998L24.7836,23.7547C24.2989,23.916,23.9186,24.2963,23.7572,24.7811L20.4625,34.665400000000005C20.396900000000002,34.864999999999995,20.2105,35,20.0004,35C19.790300000000002,35,19.6039,34.864999999999995,19.5383,34.665400000000005L16.2452,24.7811C16.0838,24.2963,15.7035,23.916,15.2188,23.7547L5.334543,20.459899999999998C5.134924,20.3943,5.000000000000048,20.207900000000002,5.000000000000048,19.997799999999998C4.999999907221,19.7877,5.134924,19.601300000000002,5.334543,19.5357L15.2188,16.2441C15.7035,16.0828,16.0838,15.7025,16.2452,15.2177L19.5399,5.333385C19.6247,5.0779026,19.9008,4.9398337,20.156,5.0253095L20.154400000000003,5.0236888Z"
                    fill="url(#master_svg1_855_055841)"
                    fill-opacity="1"
                  />
                </g>
                <g style={{ opacity: 0.5 }}>
                  <path
                    d="M30.0454808,6.61533625C30.0174872,6.62583625,29.999233409,6.65293625,30.0000247287,6.68282625C30.000814711,6.71271625,30.0204761,6.73880625,30.0489843,6.74781625L32.41352,7.52933625L33.2671,9.967146249999999C33.27687,9.99537625,33.30346,10.01431625,33.333330000000004,10.01431625C33.3632,10.01431625,33.38978,9.99537625,33.39955,9.967146249999999L34.25314,7.52933625L36.617670000000004,6.74781625C36.64618,6.73880625,36.66584,6.71271625,36.66663,6.68282625C36.66742,6.65293625,36.64917,6.62583625,36.62118,6.61533625L34.25314,5.68941625L33.39955,3.39390175C33.3923,3.37460215,33.37692,3.35947515,33.35751,3.35184543C33.32113,3.33869967,33.280969999999996,3.35752393,33.2678,3.39390105L32.41352,5.69011625L30.0454808,6.61533625Z"
                    fill="url(#master_svg2_855_055841)"
                    fill-opacity="1"
                  />
                </g>
                <g style={{ opacity: 0.5 }}>
                  <path
                    d="M3.3736058,33.26768C3.3456122,33.27818,3.327358409,33.30528,3.3281497287,33.33517C3.328939711,33.36506,3.3486011,33.39115,3.3771093,33.40016L5.741645,34.18168L6.595225,36.61949C6.604995000000001,36.64772,6.631584999999999,36.66666,6.661455,36.66666C6.691325,36.66666,6.717905,36.64772,6.727675,36.61949L7.581265,34.18168L9.945795,33.40016C9.974305000000001,33.39115,9.993965,33.36506,9.994755,33.33517C9.995545,33.30528,9.977295,33.27818,9.949304999999999,33.26768L7.581265,32.34176L6.727675,30.0462455C6.7204250000000005,30.0269459,6.705045,30.0118189,6.6856349999999996,30.00418918C6.649255,29.99104342,6.609095,30.00986768,6.595924999999999,30.0462448L5.741645,32.34246L3.3736058,33.26768Z"
                    fill="url(#master_svg3_855_055841)"
                    fill-opacity="1"
                  />
                </g>
              </g>
            </svg>
            <div>
              {getText('aiLoading', chartObj.props?.language || chartObj.context.language, chartObj.context.locale)}
            </div>
          </div>
        </div>
      ) : (
        <div className={`${prefix}`} style={{ background: 'none', transform: 'translateX(-50%)' }}>
          <div className={`${prefix}-right-tip`}>
            <div className={`${prefix}-indicator`}>
              <div className={`${prefix}-fusion-reactor`}>
                <span className={`${prefix}-dot`}></span>
                <span className={`${prefix}-dot`}></span>
                <span className={`${prefix}-dot`}></span>
                <span className={`${prefix}-dot`}></span>
              </div>
            </div>
            <div className={`${prefix}-tip-content`}>
              {getText('loading', chartObj.props?.language || chartObj.context.language, chartObj.context.locale)}
            </div>
          </div>
        </div>
      ));
    ReactDOM.render(loadingElement, element);
    chartObj.chart.annotation().html({
      html: element,
      alignX: 'middle',
      alignY: 'middle',
      position: ['50%', '50%'],
    });
  }
  // 空数据处理
  else if (chartObj.isEmpty && !chartObj.props.children) {
    // 设置背景色
    if (chartObj.chartRule.emptyData === EmptyDataProcess.Background) {
      chartObj.chartDom.style.backgroundColor = themes['widgets-color-layout-background'];
    }

    // 加暂无数据提示
    const element = document.createElement('div');
    const emptyElement = chartObj.props?.emptyInfo ?? (
      <div style={{ display: 'flex', alignItems: 'center', transform: 'translateX(-50%)' }}>
        <svg width="14px" height="14px" viewBox="0 0 1024 1024">
          <path
            d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448-448-200.576-448-448 200.576-448 448-448z m11.2 339.2h-64l-1.3888 0.032A32 32 0 0 0 427.2 435.2l0.032 1.3888A32 32 0 0 0 459.2 467.2h32v227.2H448l-1.3888 0.032A32 32 0 0 0 448 758.4h140.8l1.3888-0.032A32 32 0 0 0 588.8 694.4h-33.6V435.2l-0.032-1.3888A32 32 0 0 0 523.2 403.2zM512 268.8a44.8 44.8 0 1 0 0 89.6 44.8 44.8 0 0 0 0-89.6z"
            fill="#AAAAAA"
          ></path>
        </svg>
        <span style={{ fontSize: 12, color: '#808080', marginLeft: 5 }}>
          {getText('empty', chartObj.props?.language || chartObj.context.language, chartObj.context.locale)}
        </span>
      </div>
    );
    ReactDOM.render(emptyElement, element);
    chartObj.chart.annotation().html({
      html: element,
      alignX: 'middle',
      alignY: 'middle',
      position: ['50%', '50%'],
    });
  } else {
    // 当不是无数据状态时需要删除对应背景色
    chartObj.chartDom.style.removeProperty('background-color');
  }

  // 大数据处理
  // if (
  //   isBigDataBeforePaint(
  //     chartObj?.chartRule?.name,
  //     chartObj?.chartRule?.bigData?.judgements,
  //     chartObj.chart,
  //     chartObj.dataSize,
  //     chartObj.chartRule.mainAxis,
  //   )
  // ) {
  //   chartObj.isBigData = true;
  //   // 渲染前只有提示信息，不进行大数据处理
  // }
  // else {
  //   chartObj.isBigData = false;
  // }
}

// todo
/** 图表绘制后运行的规则 */

/** 数据改变时运行的规则，返回true表示需要重绘 */
export function runAfterDataChangedRule(chartObj: any, config: any, data: any) {
  const { chartRule } = chartObj;
  if (!chartRule) {
    return false;
  }

  let needRerender = false;

  // 数据结构检测
  // if (!checkData(chartRule.dataStructure, data)) {
  //   needRerender = !chartObj.errorInfo;
  //   chartObj.errorInfo = getText(
  //     'error',
  //     chartObj.props?.language || chartObj.context.language,
  //     chartObj.context.locale,
  //   );
  //   return false;
  // } else {
  //   needRerender = !!chartObj.errorInfo;
  //   chartObj.errorInfo = '';
  // }

  // if (needRerender) {
  //   return needRerender;
  // }

  // 计算数据量
  const dataSize = calcDataSize(chartRule.dataStructure, data);
  chartObj.dataSize = dataSize;

  // 空数据处理
  // 在空数据与有数据之间切换需要重绘
  if (isEmptyData(dataSize)) {
    needRerender = !chartObj.isEmpty;
    chartObj.isEmpty = true;
    return needRerender;
  } else {
    needRerender = chartObj.isEmpty;
    chartObj.isEmpty = false;
  }

  if (needRerender) {
    return needRerender;
  }

  // 极端数据处理
  // 仅检测，不作处理
  if (chartRule.extremeData) {
    const extremeProcess = chartRule.extremeData;
    const { isExtreme } = extremeProcess?.(chartObj, config, data);
    needRerender = (chartObj.isExtreme ?? false) !== isExtreme;
    chartObj.isExtreme = isExtreme;
  }

  return needRerender;
}
