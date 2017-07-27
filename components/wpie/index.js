'use strict';

import highFactory from '../chartCommon/highFactory';
import HighPie from './HighPie';
import g2Factory from '../chartCommon/g2Factory';

import G2Pie from './G2Pie';
const newG2Pie = g2Factory('G2Pie', G2Pie);

export { newG2Pie as G2Pie };
export default highFactory('HighPie', HighPie);
