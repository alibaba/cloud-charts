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
    ReactDOM.render(
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translateX(-50%)' }}>
        <svg width="13.990234375px" height="13.990234375px" viewBox="0 0 13.990234375 13.990234375">
          <g>
            <path
              d="M13.2992,4.0833C12.1972,1.5882,9.71352,0.00200162,6.99922,0C5.33879,-0.00111527,3.72987,0.576434,2.44922,1.6333L12.3659,11.55C14.1045,9.4635,14.497,6.5439,13.2992,4.0833ZM11.55,12.3667L1.6333,2.44995C0.576382,3.73057,-0.00117366,5.33951,0,6.99995C0.00200179,9.71425,1.5883,12.198,4.0833,13.3C6.544,14.4978,9.4635,14.1053,11.55,12.3667Z"
              fillRule="evenodd"
              fill={themes['widgets-error-svg-color']}
            />
          </g>
        </svg>
        <div style={{ fontSize: 12, color: themes['widgets-color-text-3'], marginLeft: 5 }}>
          {chartObj.props?.errorInfo}
        </div>
      </div>,
      element,
    );
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
    const prefix = `${PrefixName}-wplaceholder-loading`;
    chartObj.chart.annotation().html({
      html: `
    <div class="${prefix}" style="background: none;">
      <div class="${prefix}-right-tip">
      <div class="${prefix}-indicator">
        <div class="${prefix}-fusion-reactor">
          <span class="${prefix}-dot"></span>
          <span class="${prefix}-dot"></span>
          <span class="${prefix}-dot"></span>
          <span class="${prefix}-dot"></span>
        </div>
      </div>
      <div class="${prefix}-tip-content">${getText(
        'loading',
        chartObj.props?.language || chartObj.context.language,
        chartObj.context.locale,
      )}</div>
    </div>
  </div>
      `,
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
    chartObj.chart.annotation().html({
      html: `
          <div style="display: flex; align-items: center;">
            <svg width="14px" height="14px" viewBox="0 0 1024 1024"><path d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448-448-200.576-448-448 200.576-448 448-448z m11.2 339.2h-64l-1.3888 0.032A32 32 0 0 0 427.2 435.2l0.032 1.3888A32 32 0 0 0 459.2 467.2h32v227.2H448l-1.3888 0.032A32 32 0 0 0 448 758.4h140.8l1.3888-0.032A32 32 0 0 0 588.8 694.4h-33.6V435.2l-0.032-1.3888A32 32 0 0 0 523.2 403.2zM512 268.8a44.8 44.8 0 1 0 0 89.6 44.8 44.8 0 0 0 0-89.6z" fill="#AAAAAA"></path></svg>
            <span style="font-size: 12px;color: #808080; margin-left: 5px;">${getText(
              'empty',
              chartObj.props?.language || chartObj.context.language,
              chartObj.context.locale,
            )}<span>
          </div>
        `,
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
