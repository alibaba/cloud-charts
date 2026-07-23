import React from 'react';
import { ChartProvider } from '@alicloud/cloud-charts';
import { VanillaMount } from './VanillaMount';

const columnStyle = {
  flex: 1,
  minWidth: 300,
  border: '1px solid rgba(128,128,128,0.3)',
  borderRadius: 4,
  padding: 8,
};
const titleStyle = {
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 8,
  color: 'inherit',
  opacity: 0.85,
};

/** 单列错误边界：某一列渲染失败不影响另一列。 */
class ColumnBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0392b', fontSize: 12, textAlign: 'center', padding: 8 }}>
          渲染失败：{String(this.state.error.message || this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * 双列对比：左列为 v3 vanilla 渲染（@alicloud/cloud-charts-line 等），
 * 右列为旧 React 组件（@alicloud/cloud-charts，G2 v4 老内核）。
 * renderVanilla(container, { themeName }) 由调用方实现，内部应调用 v3 包的 render*Model。
 */
export function CompareTwoCols({ renderVanilla, OldComponent, data, config, themeName = 'normal', height = 300, language = 'zh-CN', oldProps, newPackageLabel }) {
  const labelColor = themeName === 'dark' ? '#cccccc' : '#333333';
  return (
    <ChartProvider language={language} theme={themeName}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', color: labelColor }}>
        <div style={columnStyle}>
          <div style={titleStyle}>新 Vanilla（{newPackageLabel || '@alicloud/cloud-charts-*'}）</div>
          <ColumnBoundary>
            <VanillaMount
              height={height}
              deps={[themeName, language, JSON.stringify(config)]}
              render={(container) => renderVanilla(container, { themeName, language })}
            />
          </ColumnBoundary>
        </div>
        <div style={columnStyle}>
          <div style={titleStyle}>旧 React API（@alicloud/cloud-charts 1.x）</div>
          <ColumnBoundary>
            <OldComponent height={String(height)} data={data} config={config} language={language} {...oldProps} />
          </ColumnBoundary>
        </div>
      </div>
    </ChartProvider>
  );
}
