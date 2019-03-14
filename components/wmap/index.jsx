import React from 'react';
import g2Factory from "../common/g2Factory";
import G2Map, { AREA_NAME, POINT_NAME, HEAT_MAP_NAME, CUSTOM_NAME, convertPointPosition } from "./G2Map";
import SouthChinaSea from './mapData/southChinaSea';
import { color } from '../theme/index';

const MapBase = g2Factory('G2Map', G2Map, false);
const rootClassName = 'aisc-widgets ';
// const southChinaSea = SouthChinaSea({
//   className: 'aisc-widgets-map-south-china-sea',
//   fontColor: color.widgetsMapAreaBg,
//   landColor: color.widgetsMapAreaBg,
//   lineColor: color.widgetsMapAreaBg,
//   boxColor: color.widgetsMapAreaBg,
//   islandColor: color.widgetsMapAreaBg
// });

class Map extends MapBase {
  constructor(props, context) {
    super(props, context);

    this.state = {
      customPointLayer: []
    };
  }

  // componentDidMount() {
  //   super.componentDidMount();
  //
  //   setTimeout(() => {
  //     this.convertChildren();
  //   }, 0);
  // }

  componentWillReceiveProps(nextProps) {
    if (!this.isReRendering && nextProps.children !== this.props.children) {
      this.convertChildren(nextProps.children, nextProps.config);
    }

    super.componentWillReceiveProps(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { customPointLayer: newLayer } = nextState;
    const { customPointLayer: oldLayer } = this.state;
    if (this.isReRendering || !this.chart) {
      return false;
    }

    return super.shouldComponentUpdate(nextProps, nextState) || newLayer !== oldLayer;
  }

  convertChildren(children = this.props.children, config = this.props.config) {
    const customPointLayer = [];
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }
      if (child.type.displayName === 'WidgetsMapCustom') {
        customPointLayer.push(child.props);
        return;
      }

      const { data, ...propsConfig } = child.props;
      const layerConfig = Object.assign({}, config, propsConfig);

      this.chartProcess.changeData.call(this, this.chart, layerConfig, child.type.displayName, data);
    });
    this.setState({
      customPointLayer
    });
  }

  renderCustomPointLayer(layer, layerIndex) {
    if (!this.chart) {
      return null;
    }
    const { data, render, ...otherProps } = layer;
    const width = this.chart.get('width');
    const height = this.chart.get('height');
    const [ cW, cH ] = this._size;
    const layerStyle = {
      left: (cW - width) / 2,
      top: (cH - height) / 2,
      width,
      height,
    };

    return (
      <div key={layerIndex} className="aisc-widgets-map-custom-container" style={layerStyle}>
        {
          Array.isArray(data) && data.map((d, i) => {
            let point = convertPointPosition.call(this, d);
            point = this.bgMapView.getXY(point);
            if (!point) {
              return null;
            }

            const pointStyle = {
              left: point.x,
              top: point.y,
            };
            return (
              <div key={i} className="aisc-widgets-map-custom-point" style={pointStyle}>
                {render && render(d, i, otherProps)}
              </div>
            );
          })
        }
      </div>
    );
  }

  renderSouthChinaSea(config) {
    if (config.showSouthChinaSea === undefined || config.showSouthChinaSea) {
      const { fill } = config.background || {};
      const mapColor = fill || color.widgetsMapAreaBg;

      return <SouthChinaSea className="aisc-widgets-map-south-china-sea" fontColor={mapColor} landColor={mapColor} lineColor={mapColor} boxColor={mapColor} islandColor={mapColor} />;
    } else {
      return null;
    }
  }

  render() {
    const { className = '', style, children, data, width, height, padding, config, ...otherProps } = this.props;
    const { customPointLayer } = this.state;
    return (
      <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + 'G2Map ' + className} style={style} {...otherProps}>
        {this.renderSouthChinaSea(config)}
        {
          customPointLayer.length > 0 && customPointLayer.map((layer, i) => {
            return this.renderCustomPointLayer(layer, i);
          })
        }
        <div className="aisc-widgets-map-legend" id={this.chartId + '-legend'}></div>
      </div>
    );
  }
}

// 地图不需要校验data
delete Map.propTypes.data;

/**
 * @return {null}
 */
Map.Area = function WidgetsMapArea() { return null; };
Map.Area.displayName = AREA_NAME;

/**
 * @return {null}
 */
Map.Point = function WidgetsMapPoint() { return null; };
Map.Point.displayName = POINT_NAME;

/**
 * @return {null}
 */
Map.HeatMap = function WidgetsMapHeatMap() { return null; };
Map.HeatMap.displayName = HEAT_MAP_NAME;

/**
 * @return {null}
 */
Map.Custom = function WidgetsMapCustom() { return null; };
Map.Custom.displayName = CUSTOM_NAME;

export default Map;