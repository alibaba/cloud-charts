'use strict';

import highFactory from '../chartCommon/highFactory';
import g2Factory from '../chartCommon/g2Factory';
import HighBar from './HighBar';
import G2Bar from './G2Bar';
const newG2Bar = g2Factory('G2Bar', G2Bar);

export { newG2Bar as G2Bar };
export default highFactory('HighBar', HighBar);
