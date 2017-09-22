import Highcharts from 'highcharts';
import highFactory from './chartCommon/highFactory';

import HighLine from './wline/HighLine';
import HighBar from './wbar/HighBar';
import HighPie from './wpie/HighPie';
import HighLineBar from './wlinebar/HighLineBar';

//暴露所有基础图表
export const WHighLine = highFactory('HighLine', HighLine);
export const WHighBar = highFactory('HighBar', HighBar);
export const WHighPie = highFactory('HighPie', HighPie);
export const WHighLineBar = highFactory('HighLineBar', HighLineBar);

//暴露基础图表库
export { Highcharts }

export const Wline = WHighLine;
export const Wbar = WHighBar;
export const Wpie = WHighPie;
export const Wlinebar = WHighLineBar;
