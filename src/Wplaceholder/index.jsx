'use strict';

import React from 'react';
import classNames from 'classnames';
import chartLog from "../common/log";
import Locale from './locale';
import './index.scss';

const prefix = 'cloud-wplaceholder';

// 默认显示的图标
const svgWidth = 36, svgHeight = 32, itemHeight1 = 20, itemHeight2 = 26, itemHeight3 = 32;
const svg = <svg width={svgWidth} height={svgHeight} className="placeholder-box">
  <rect className="placeholder-item item-1" width="8" height={itemHeight1} x="0" y={svgHeight - itemHeight1} />
  <rect className="placeholder-item item-2" width="8" height={itemHeight3} x="14" y={svgHeight - itemHeight3} />
  <rect className="placeholder-item item-3" width="8" height={itemHeight2} x="28" y={svgHeight - itemHeight2} />
</svg>;

// 异常状态显示的图标
const errorSvg = <svg width="43px" height="36px" viewBox="0 0 43 36">
  <rect className="placeholder-item" x="0" y="12" width="8" height="20" />
  <path className="placeholder-item" d="M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z" />
  <path className="placeholder-item" d="M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z" />
  <path className="placeholder-item" d="M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z M31.5,34 C36.7467051,34 41,29.7467051 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C26.2532949,15 22,19.2532949 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 Z" fillRule="nonzero" />
  <rect className="placeholder-item" x="30" y="17" width="3" height="9" />
  <rect className="placeholder-item" x="30" y="28" width="3" height="3" />
</svg>;

// 无数据状态显示的图标
const noDataSvg = <svg width="43px" height="36px" viewBox="0 0 43 36" style={{marginLeft: 5}}>
  {/*<g id="数据异常情况展示" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">*/}
    {/*<g id="图表最新样式-copy-3" transform="translate(-660.000000, -1506.000000)" fill="#F2F3F7">*/}
      {/*<g transform="translate(3, 0)">*/}
        <polygon className="placeholder-item" points="0 12 8 12 8 32 0 32" />
        <path className="placeholder-item" d="M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z" />
        <path className="placeholder-item" d="M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z" />
        <path className="placeholder-item" d="M23.8056018,18.9269221 C22.6697689,20.4923786 22,22.4179728 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 C33.5820272,34 35.5076214,33.3302311 37.0730779,32.1943982 L23.8056018,18.9269221 Z M25.9269221,16.8056018 L39.1943982,30.0730779 C40.3302311,28.5076214 41,26.5820272 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C29.4179728,15 27.4923786,15.6697689 25.9269221,16.8056018 Z M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z" fillRule="nonzero" />
      {/*</g>*/}
    {/*</g>*/}
  {/*</g>*/}
</svg>;

// 获取显示文案
function getLocaleText (locale = {}, loading, error, noData) {
  // 优先取error状态
  if (error) {
    return locale.error;
  }
  // 其次取loading状态
  if (loading) {
    return locale.loading;
  }
  // 其次取loading状态
  if (noData) {
    return locale.noData;
  }
}

export default class Wplaceholder extends React.Component {
  static displayName = 'Wplaceholder';

  constructor(props) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wplaceholder', 'init');
  }

  renderText(loading, error, noData) {
    const { locale, language, children } = this.props;
    // text 优先判断传入的locale，其次判断传入的language，最后取中文locale
    const text = getLocaleText(locale || Locale[language] || Locale['zh-cn'], loading, error, noData) || '';
    if (children) {
      // 优先渲染children
      return <div className={prefix + '-children-text'}>{children}</div>;
    } else if (text) {
      return <div className={prefix + '-children-text'}>{text}</div>;
    } else {
      return null;
    }
  }

  render() {
    const { className, width, height = '100%', style, loading, error, noData, ...otherProps } = this.props;

    const mainClasses = classNames(prefix, {
      'cloud-charts': true,
      [prefix + '-loading']: !error && loading,
      [prefix + '-no-data']: !error && !loading && noData,
      [prefix + '-error']: !!error,
      [className]: !!className
    });

    let renderSvg = svg;
    if (error) {
      renderSvg = errorSvg;
    } else if (!loading && noData) {
      renderSvg = noDataSvg;
    }

    return (
      <div className={mainClasses}
           style={{
             width,
             height,
             ...style
           }}
           {...otherProps}
      >
        <div className={prefix + '-children'}>
          {renderSvg}
          {this.renderText(loading, error, noData)}
        </div>
      </div>
    );
  }
}

