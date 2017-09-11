'use strict';

import highFactory from '../chartCommon/highFactory';
import g2Factory from '../chartCommon/g2Factory';
import HighBar from './HighBar';
import G2Bar from './G2Bar';

const WG2Bar = g2Factory('G2Bar', G2Bar);
const WHighBar = highFactory('HighBar', HighBar);

export { WHighBar, WG2Bar };
