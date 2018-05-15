import React from 'react';
import g2Factory from "../chartCommon/g2Factory";
import G2Map, { convertPointPosition } from "./G2Map";
import SouthChinaSea from './southChinaSea';
import { color } from '../theme/normal';

const MapBase = g2Factory('G2Map', G2Map, false);
const rootClassName = 'aisc-widgets ';
const southChinaSea = SouthChinaSea({
  className: 'aisc-widgets-map-south-china-sea',
  fontColor: color.widgetsMapAreaBg,
  landColor: color.widgetsMapAreaBg,
  lineColor: color.widgetsMapAreaBg,
  boxColor: color.widgetsMapAreaBg,
  islandColor: color.widgetsMapAreaBg
});

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
    if (nextProps.children !== this.props.children) {
      this.convertChildren(nextProps.children, nextProps.config);
    }

    super.componentWillReceiveProps(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { customPointLayer: newLayer } = nextState;
    const { customPointLayer: oldLayer } = this.state;

    return super.shouldComponentUpdate(nextProps, nextState) || newLayer !== oldLayer;
  }

  convertChildren(children = this.props.children, config = this.props.config) {
    const customPointLayer = [];
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }
      if (child.type.name === 'MapCustom') {
        customPointLayer.push(child.props);
      }

      let { data } = child.props;
      this.chartProcess.changeData.call(this, this.chart, config, child.type.name, data);
    });
    this.setState({
      customPointLayer
    });
  }

  renderCustomPointLayer(layer, layerIndex) {
    const { data, render } = layer;
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
            const pointStyle = {
              left: point.x,
              top: point.y,
            };
            return (
              <div key={i} className="aisc-widgets-map-custom-point" style={pointStyle}>
                {render && render(d, i)}
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    const { className = '', style, children, data, width, height, padding, config, ...otherProps } = this.props;
    const { customPointLayer } = this.state;
    return (
      <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + 'G2Map ' + className} style={style} {...otherProps}>
        {
          config.showSouthChinaSea === undefined || config.showSouthChinaSea ?
            southChinaSea : null
        }
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
Map.Area = function MapArea() { return null; };

/**
 * @return {null}
 */
Map.Point = function MapPoint() { return null; };

/**
 * @return {null}
 */
Map.Custom = function MapCustom() { return null; };

export default Map;