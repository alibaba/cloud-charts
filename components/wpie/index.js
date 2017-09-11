'use strict';

import highFactory from '../chartCommon/highFactory';
import g2Factory from '../chartCommon/g2Factory';
import HighPie from './HighPie';
import G2Pie from './G2Pie';

const WG2Pie = g2Factory('G2Pie', G2Pie);
const WHighPie = highFactory('HighPie', HighPie);

export { WHighPie, WG2Pie };
