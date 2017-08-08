'use strict';

import highFactory from '../chartCommon/highFactory';
import g2Factory from '../chartCommon/g2Factory';
import HighLine from './HighLine';
import G2Line from './G2Line';

const WG2Line = g2Factory('G2Line', G2Line);
const WHighLine = highFactory('HighLine', HighLine);

export { WG2Line, WHighLine };
