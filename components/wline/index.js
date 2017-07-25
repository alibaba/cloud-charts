'use strict';

import highFactory from '../chartCommon/highFactory';
import g2Factory from '../chartCommon/g2Factory';
import HighLine from './HighLine';
import G2Line from './G2Line';
const newG2Line = g2Factory('G2Line', G2Line);

export { newG2Line as G2Line };
export default highFactory('HighLine', HighLine);