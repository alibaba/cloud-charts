'use strict';

import * as React from 'react';
import classNames from 'classnames';
import merge from 'lodash/merge';
import chartLog from '../common/log';
import Locale, { LocaleItem } from '../locales';
import { FullCrossName, PrefixName } from '../constants';
import { ChartContext, getText } from '../ChartProvider';
import { warn } from '../common/log';
import './index.scss';

const prefix = `${PrefixName}-wplaceholder`;

// 默认显示的图标
const svgWidth = 36,
  svgHeight = 32,
  itemHeight1 = 20,
  itemHeight2 = 26,
  itemHeight3 = 32;
const svg = (
  <svg width={svgWidth} height={svgHeight} className="placeholder-box">
    <rect className="placeholder-item item-1" width="8" height={itemHeight1} x="0" y={svgHeight - itemHeight1} />
    <rect className="placeholder-item item-2" width="8" height={itemHeight3} x="14" y={svgHeight - itemHeight3} />
    <rect className="placeholder-item item-3" width="8" height={itemHeight2} x="28" y={svgHeight - itemHeight2} />
  </svg>
);

// 异常状态显示的图标
const errorSvg = (
  <svg width="43px" height="36px" viewBox="0 0 43 36">
    <rect className="placeholder-item" x="0" y="12" width="8" height="20" />
    <path
      className="placeholder-item"
      d="M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z"
    />
    <path
      className="placeholder-item"
      d="M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z"
    />
    <path
      className="placeholder-item"
      d="M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z M31.5,34 C36.7467051,34 41,29.7467051 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C26.2532949,15 22,19.2532949 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 Z"
      fillRule="nonzero"
    />
    <rect className="placeholder-item" x="30" y="17" width="3" height="9" />
    <rect className="placeholder-item" x="30" y="28" width="3" height="3" />
  </svg>
);

// 无数据状态显示的图标
const noDataSvg = (
  <svg width="43px" height="36px" viewBox="0 0 43 36" style={{ marginLeft: 5 }}>
    {/*<g id="数据异常情况展示" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">*/}
    {/*<g id="图表最新样式-copy-3" transform="translate(-660.000000, -1506.000000)" fill="#F2F3F7">*/}
    {/*<g transform="translate(3, 0)">*/}
    <polygon className="placeholder-item" points="0 12 8 12 8 32 0 32" />
    <path
      className="placeholder-item"
      d="M21,16.0139985 C19.1238002,18.3325877 18,21.285055 18,24.5 C18,27.27522 18.8374075,29.8548529 20.2733236,32 L13,32 L13,0 L21,0 L21,16.0139985 Z"
    />
    <path
      className="placeholder-item"
      d="M34,11.2310283 C33.1898394,11.0793314 32.3541841,11 31.5,11 C29.5412332,11 27.6799005,11.4171646 26,12.1674956 L26,5 L34,5 L34,11.2310283 Z"
    />
    <path
      className="placeholder-item"
      d="M23.8056018,18.9269221 C22.6697689,20.4923786 22,22.4179728 22,24.5 C22,29.7467051 26.2532949,34 31.5,34 C33.5820272,34 35.5076214,33.3302311 37.0730779,32.1943982 L23.8056018,18.9269221 Z M25.9269221,16.8056018 L39.1943982,30.0730779 C40.3302311,28.5076214 41,26.5820272 41,24.5 C41,19.2532949 36.7467051,15 31.5,15 C29.4179728,15 27.4923786,15.6697689 25.9269221,16.8056018 Z M31.5,36 C25.1487254,36 20,30.8512746 20,24.5 C20,18.1487254 25.1487254,13 31.5,13 C37.8512746,13 43,18.1487254 43,24.5 C43,30.8512746 37.8512746,36 31.5,36 Z"
      fillRule="nonzero"
    />
    {/*</g>*/}
    {/*</g>*/}
    {/*</g>*/}
  </svg>
);

const emptySvg = (
  <svg width="14px" height="14px" viewBox="0 0 1024 1024">
    <path
      d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448-448-200.576-448-448 200.576-448 448-448z m11.2 339.2h-64l-1.3888 0.032A32 32 0 0 0 427.2 435.2l0.032 1.3888A32 32 0 0 0 459.2 467.2h32v227.2H448l-1.3888 0.032A32 32 0 0 0 448 758.4h140.8l1.3888-0.032A32 32 0 0 0 588.8 694.4h-33.6V435.2l-0.032-1.3888A32 32 0 0 0 523.2 403.2zM512 268.8a44.8 44.8 0 1 0 0 89.6 44.8 44.8 0 0 0 0-89.6z"
      fill="#AAAAAA"
    ></path>
  </svg>
);

const loadingDom = (text: string) => {
  return (
    <div className={`${prefix}-loading-right-tip`}>
      <div className={`${prefix}-loading-indicator`}>
        <div className={`${prefix}-loading-fusion-reactor`}>
          <span className={`${prefix}-loading-dot`}></span>
          <span className={`${prefix}-loading-dot`}></span>
          <span className={`${prefix}-loading-dot`}></span>
          <span className={`${prefix}-loading-dot`}></span>
        </div>
      </div>
      <div className={`${prefix}-loading-tip-content`}>{text}</div>
    </div>
  );
};

// 获取显示文案
function getLocaleText(locale: LocaleItem, language: keyof typeof Locale, loading: boolean, error: boolean, noData: boolean, empty: boolean) {
  const value = error ? 'error' : loading ? 'loading' : noData ? 'noData' : empty ? 'empty' : null;
  if (value) {
    return getText(value, language, locale);
  }
  return null;
}

interface WplaceholderProps {
  className?: string;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  loading?: boolean;
  error?: boolean;
  noData?: boolean;
  empty?: boolean;
  locale?: LocaleItem;
  language?: keyof typeof Locale;
}

export default class Wplaceholder extends React.Component<WplaceholderProps> {
  static displayName = 'Wplaceholder';

  static contextType = ChartContext;

  constructor(props: WplaceholderProps) {
    super(props);

    // 图表初始化时记录日志
    chartLog('Wplaceholder', 'init');
  }

  renderText(loading: boolean, error: boolean, noData: boolean, empty: boolean) {
    const { locale, language, children } = this.props;
    // text 优先判断传入的locale，其次判断传入的language，最后取中文locale
    const text = getLocaleText(locale||this.context.locale,language||this.context.language, loading, error, noData, empty) || '';
    if (children) {
      // 优先渲染children
      return <div className={prefix + '-children-text'}>{children}</div>;
    } else if (empty) {
      return (
        <div className={prefix + '-children-text'} style={{
          marginTop: 0
        }}>
          {emptySvg}
          <span
            style={{
              marginLeft: 4,
            }}
          >
            {text}
          </span>
        </div>
      );
    } else if (loading) {
      return loadingDom(text);
    } else if (text) {
      return <div className={prefix + '-children-text'}>{text}</div>;
    } else {
      return null;
    }
  }

  render() {
    const { className, width, height = '100%', style, loading, error, noData, empty, locale, language, ...otherProps } = this.props;

    const mainClasses = classNames(prefix, {
      [FullCrossName]: true,
      [prefix + '-loading']: !error && loading,
      [prefix + '-no-data']: !error && !loading && noData,
      [prefix + '-empty']: !error && !loading && empty,
      [prefix + '-error']: !!error,
      [className]: !!className,
    });

    let renderSvg = svg;
    if (error) {
      renderSvg = errorSvg;
    } else if (!loading && noData) {
      renderSvg = noDataSvg;
      warn('Wplaceholder', 'noData属性已废弃，如果基础图表如Wline无数据，无需额外使用该组件，如为业务自定义组件，请使用empty属性。');

      chartLog('Wplaceholder', 'rulesInfo', {
        selector: `#${prefix}-no-data`,
        checkItem: 'empty',
        errorInfo: {
          value: 'noData', // 错误的值
          errorValue: 1, // 错误的数量
          errorRate: 1
        }
      });
    } else if (empty) {
      renderSvg = <></>;
    } else if (loading) {
      renderSvg = <></>;
    }

    return (
      <div
        className={mainClasses}
        style={{
          width,
          height,
          ...style,
        }}
        {...otherProps}
      >
        {loading ? (
          loadingDom(getText('loading',language||this.context.language,locale||this.context.locale))
        ) : (
          <div className={prefix + '-children'}>
            {renderSvg}
            {this.renderText(loading, error, noData, empty)}
          </div>
        )}
      </div>
    );
  }
}
