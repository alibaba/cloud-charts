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
import LoadingStarIcon from '../common/LoadingStarIcon';

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
      const { data: bigReplaceData, config: bigDataConfig } = chartRule?.bigData?.process?.(
        chartObj,
        data,
      );

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

  // 特殊状态的容器
  const existedContainer = chartObj.chartDom?.querySelector(
    `.${PrefixName}-wplaceholder-container`,
  );
  let container = existedContainer;
  if (!container) {
    container = document.createElement('div');
    container.className = `${PrefixName}-wplaceholder-container`;
  }

  // 状态：error > loading > empty
  // error
  if (chartObj?.props?.errorInfo && !chartObj.props.children) {
    // 设置背景色
    if (chartObj.chartRule.emptyData === EmptyDataProcess.Background) {
      chartObj.chartDom.style.backgroundColor = themes['widgets-color-layout-background'];
    }
    // 加错误提示
    ReactDOM.render(<div>{chartObj.props?.errorInfo}</div>, container);
    chartObj.chartDom.appendChild(container);
  }
  // loading
  else if (chartObj?.props?.loading && !chartObj.props.children) {
    // 设置背景色
    if (chartObj.chartRule.emptyData === EmptyDataProcess.Background) {
      chartObj.chartDom.style.backgroundColor = themes['widgets-color-layout-background'];
    }

    // 加loading提示
    const prefix = `${PrefixName}-wplaceholder-loading`;
    const loadingElement = chartObj.props?.loadingInfo ? (
      <div>{chartObj.props?.loadingInfo}</div>
    ) : chartObj.props?.stateType === 'ai' ? (
      <div className={`${prefix}`} style={{ background: 'none' }}>
        <div className={`${prefix}-right-tip`}>
          <LoadingStarIcon />
          <div>
            {getText(
              'aiLoading',
              chartObj.props?.language || chartObj.context.language,
              chartObj.context.locale,
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className={`${prefix}`} style={{ background: 'none' }}>
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
            {getText(
              'loading',
              chartObj.props?.language || chartObj.context.language,
              chartObj.context.locale,
            )}
          </div>
        </div>
      </div>
    );
    ReactDOM.render(loadingElement, container);
    chartObj.chartDom.appendChild(container);
  }
  // 空数据处理
  else if (chartObj.isEmpty && !chartObj.props.children) {
    // 设置背景色
    if (chartObj.chartRule.emptyData === EmptyDataProcess.Background) {
      chartObj.chartDom.style.backgroundColor = themes['widgets-color-layout-background'];
    }

    // 加暂无数据提示
    const emptyElement = chartObj.props?.emptyInfo ? (
      <div>{chartObj.props?.emptyInfo}</div>
    ) : (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <svg width="14px" height="14px" viewBox="0 0 1024 1024">
          <path
            d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448-448-200.576-448-448 200.576-448 448-448z m11.2 339.2h-64l-1.3888 0.032A32 32 0 0 0 427.2 435.2l0.032 1.3888A32 32 0 0 0 459.2 467.2h32v227.2H448l-1.3888 0.032A32 32 0 0 0 448 758.4h140.8l1.3888-0.032A32 32 0 0 0 588.8 694.4h-33.6V435.2l-0.032-1.3888A32 32 0 0 0 523.2 403.2zM512 268.8a44.8 44.8 0 1 0 0 89.6 44.8 44.8 0 0 0 0-89.6z"
            fill="#AAAAAA"
          ></path>
        </svg>
        <span style={{ fontSize: 12, color: '#808080', marginLeft: 5 }}>
          {getText(
            'empty',
            chartObj.props?.language || chartObj.context.language,
            chartObj.context.locale,
          )}
        </span>
      </div>
    );
    ReactDOM.render(emptyElement, container);
    chartObj.chartDom.appendChild(container);
  } else {
    // 当不是无数据状态时需要删除对应背景色
    chartObj.chartDom.style.removeProperty('background-color');

    // 删除特殊状态的元素
    if (existedContainer) {
      chartObj.chartDom.removeChild(existedContainer);
    }
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

    // 极端场景与非极端场景之间切换、极端到极端（防止配置项变化）都需要重绘
    needRerender = (chartObj.isExtreme ?? false) !== isExtreme || isExtreme;

    chartObj.isExtreme = isExtreme;
  }

  return needRerender;
}
