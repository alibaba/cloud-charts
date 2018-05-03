import g2Factory from "../chartCommon/g2Factory";
import G2Map from "./G2Map";
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

export default class Map extends MapBase {
  constructor(props, context) {
    super(props, context);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
  }

  render() {
    const { className = '', style, children, data, width, height, padding, config, ...otherProps } = this.props;
    return (
      <div ref={dom => this.chartDom = dom} id={this.chartId} className={rootClassName + 'G2Map ' + className} style={style} {...otherProps}>
        {
          config.showSouthChinaSea === undefined || config.showSouthChinaSea ?
            southChinaSea : null
        }
      </div>
    );
  }
}