'use strict';

import highFactory from '../chartCommon/highFactory';
// import g2Factory from '../chartCommon/g2Factory';
import HighLineBar from './HighLineBar';
// import G2Line from './G2Line';

// const WG2Line = g2Factory('G2Line', G2Line);
const WHighLineBar = highFactory('HighLineBar', HighLineBar);

export { WHighLineBar };
