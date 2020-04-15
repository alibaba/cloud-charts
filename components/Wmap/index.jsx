import React from 'react';
import g2Factory from "../common/g2Factory";
import errorWrap from '../common/errorWrap';
import G2Map, { AREA_NAME, POINT_NAME, HEAT_MAP_NAME, SHOOT_NAME, CUSTOM_NAME, convertPointPosition } from "./G2Map";
import Wshoot from "../Wshoot/index";
import SouthChinaSea from './mapData/southChinaSea';
import themes from '../themes/index';

const MapBase = g2Factory('G2Map', G2Map, false);
const rootClassName = 'aisc-widgets ';

class Map extends MapBase {
  constructor(props, context) {
    super(props, context);

    this.state = {
      customPointLayer: [],
      shootLayer: [],
      southChinaSeaKey: 0,
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this.convertChildren(this.props.children, this.props.config, true);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.isReRendering && this.props.children !== prevProps.children) {
      this.convertChildren(this.props.children, this.props.config);
    }

    super.componentDidUpdate(prevProps, prevState, snapshot);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(this.isReRendering || !this.chart);
  }

  rerender() {
    // fix: 动态切换主题后南海诸岛地图没有更新
    if (this.props.config.showSouthChinaSea === undefined || this.props.config.showSouthChinaSea) {
      this.setState({
        southChinaSeaKey: this.state.southChinaSeaKey + 1,
      });
    }
    return super.rerender();
  }

  convertPosition = (d) => {
    if (!d) {
      return;
    }
    let point = convertPointPosition.call(this, d);
    return this.bgMapView.getXY(point);
  };

  convertChildren(children = this.props.children, config = this.props.config, isInit = false) {
    const customPointLayer = [];
    const shootLayer = [];
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }
      if (child.type.displayName === CUSTOM_NAME) {
        let newData = child.props.data;
        if (Array.isArray(newData)) {
          newData = newData.map((d) => {
            const position = this.convertPosition(d ? { ...d } : null);
            if (!position) {
              return null;
            }
            return { ...d, x: position.x, y: position.y };
          });
        }
        customPointLayer.push({ ...child.props, data: newData });
        return;
      }
      if (child.type.displayName === SHOOT_NAME) {
        // let newData = child.props.data;
        // if (Array.isArray(newData)) {
        //   newData = newData.map((d) => {
        //     let from = { ...d.from };
        //     let to = { ...d.to };
        //     const fromPosition = this.convertPosition(from);
        //     const toPosition = this.convertPosition(to);
        //     if (fromPosition) {
        //       from.x = fromPosition.x;
        //       from.y = fromPosition.y;
        //     }
        //     if (toPosition) {
        //       to.x = toPosition.x;
        //       to.y = toPosition.y;
        //     }
        //     return { ...d, from, to };
        //   });
        // }
        // shootLayer.push({ ...child.props, data: newData });
        shootLayer.push(child.props);
        return;
      }

      if (!isInit) {
        const { data, ...propsConfig } = child.props;
        const layerConfig = Object.assign({}, config, propsConfig);

        this.chartProcess.changeData.call(this, this.chart, layerConfig, child.type.displayName, data);
      }
    });
    this.setState({
      customPointLayer,
      shootLayer,
    });
  }

  changeSize(config, w, h) {
    super.changeSize(config, w, h);

    this.convertChildren(this.props.children, this.props.config, true);
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
            if (!d) {
              return null;
            }

            const pointStyle = {
              left: d.x,
              top: d.y,
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

  renderShootLayer(shootProps, shootIndex) {
    if (!this.chart) {
      return null;
    }
    const { className, style } = shootProps;
    const width = this.chart.get('width');
    const height = this.chart.get('height');
    const [ cW, cH ] = this._size;
    const layerStyle = {
      left: (cW - width) / 2,
      top: (cH - height) / 2,
      width,
      height,
      ...(style || {})
    };

    return (
      <Wshoot
        key={shootIndex}
        className={`aisc-widgets-map-shoot ${className || ''}`}
        width={width}
        height={height}
        style={layerStyle}
        getPosition={this.convertPosition}
        {...shootProps}
      />
    );
  }

  renderSouthChinaSea(config) {
    if (config.showSouthChinaSea === undefined || config.showSouthChinaSea) {
      const { southChinaSeaKey } = this.state;
      const { fill } = config.background || {};
      const mapColor = fill || themes['widgets-map-area-bg'];

      return <SouthChinaSea key={southChinaSeaKey} className="aisc-widgets-map-south-china-sea" fontColor={mapColor} landColor={mapColor} lineColor={mapColor} boxColor={mapColor} islandColor={mapColor} />;
    } else {
      return null;
    }
  }

  render() {
    const { className = '', style, children, data, width, height, padding, geoData, config, animate, language, customChart, ...otherProps } = this.props;
    const { customPointLayer, shootLayer } = this.state;
    return (
      <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + 'G2Map ' + className} style={style} {...otherProps}>
        {this.renderSouthChinaSea(config)}
        {
          shootLayer.length > 0 && shootLayer.map((shoot, i) => {
            return this.renderShootLayer(shoot, i);
          })
        }
        {
          customPointLayer.length > 0 && customPointLayer.map((layer, i) => {
            return this.renderCustomPointLayer(layer, i);
          })
        }
        <div className="aisc-widgets-map-legend" id={this.chartId + '-legend'} />
      </div>
    );
  }
}

// 地图不需要校验data
delete Map.propTypes.data;

const MapClass = errorWrap(Map);

/**
 * @return {null}
 */
MapClass.Area = function WidgetsMapArea() { return null; };
MapClass.Area.displayName = AREA_NAME;

/**
 * @return {null}
 */
MapClass.Point = function WidgetsMapPoint() { return null; };
MapClass.Point.displayName = POINT_NAME;

/**
 * @return {null}
 */
MapClass.HeatMap = function WidgetsMapHeatMap() { return null; };
MapClass.HeatMap.displayName = HEAT_MAP_NAME;

/**
 * @return {null}
 */
MapClass.Shoot = function WidgetsMapShoot() { return null; };
MapClass.Shoot.displayName = SHOOT_NAME;

/**
 * @return {null}
 */
MapClass.Custom = function WidgetsMapCustom() { return null; };
MapClass.Custom.displayName = CUSTOM_NAME;

export default MapClass;
