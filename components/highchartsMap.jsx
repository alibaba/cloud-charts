import './index.scss';
import Highcharts from 'highcharts';

//基础图表
import { WHighLine } from './wline/index';
import { WHighBar } from './wbar/index';
import { WHighPie } from './wpie/index';
import { WHighLineBar } from './wlinebar/index';

//暴露基础图表库
export { Highcharts }

//暴露所有包含的基础图表
export {
  WHighLine,
  WHighBar,
  WHighPie,
  WHighLineBar
};

export const Wline = WHighLine;
export const Wbar = WHighBar;
export const Wpie = WHighPie;
export const Wlinebar = WHighLineBar;
