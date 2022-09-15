import type { ScaleConfig } from '@antv/scale/esm/types';
import extended from '@antv/scale/esm/util/extended';
import { head, isNil, last } from '@antv/util';
// import strictLimit from '@antv/scale/esm/util/strict-limit';
import interval from '@antv/scale/esm/util/interval';

export function integer(cfg: ScaleConfig): number[] {
  const { min, max, tickCount, nice, tickInterval, minLimit, maxLimit } = cfg;

  // console.log('integer', min, max, tickCount, nice, tickInterval, minLimit, maxLimit);

  let ticks: number[] = [];
  const integerRes = convertMiniInteger(min, max, tickCount, nice);
  // 如果有整数计算结果，则使用该 ticks
  if (integerRes) {
    ticks = integerRes.ticks;
  } else {
    ticks = extended(min, max, tickCount, nice).ticks;
  }

  // console.log('ticks', ticks);

  if (!isNil(minLimit) || !isNil(maxLimit)) {
    return strictLimit(cfg, ticks);
  }
  if (tickInterval) {
    return interval(min, max, tickInterval).ticks;
  }
  return ticks;
}

function convertMiniInteger(dMin: number, dMax: number, n: number = 5, onlyLoose: boolean = true,) {
  // 处理小于 0 和小数的 tickCount
  const m = n < 0 ? 0 : Math.round(n);

  // nan 也会导致异常
  if (Number.isNaN(dMin) || Number.isNaN(dMax) || typeof dMin !== 'number' || typeof dMax !== 'number' || !m) {
    return {
      min: 0,
      max: 0,
      ticks: [],
    };
  }

  // js 极大值极小值问题，差值小于 1e-15 会导致计算出错
  if (dMax - dMin < 1e-15 || m === 1) {
    return {
      min: dMin,
      max: dMax,
      ticks: [dMin],
    };
  }

  if (!onlyLoose) {
    return undefined;
  }

  // 相差只有 1
  if (dMax - dMin <= 1) {
    if (dMin >= 0 && dMin < 1) {
      // 值域两端接近 0，则不跨越 0
      return {
        min: 0,
        max: 2,
        ticks: [0, 1, 2],
      };
    } else if (dMax > -1 && dMax <= 0) {
      // 值域两端接近 0，则不跨越 0
      return {
        min: -2,
        max: 0,
        ticks: [-2, -1, 0],
      };
    } else {
      return {
        min: dMin - 1,
        max: dMax + 1,
        ticks: [dMin - 1, dMin, dMax, dMax + 1],
      };
    }
  }

  // 相差只有 2
  if (dMax - dMin <= 2) {
    if (dMin >= 0 && dMin < 1) {
      // 值域两端接近 0，则不跨越 0
      return {
        min: 0,
        max: 3,
        ticks: [0, 1, 2, 3],
      };
    } else if (dMax > -1 && dMax <= 0) {
      // 值域两端接近 0，则不跨越 0
      return {
        min: -3,
        max: 0,
        ticks: [-3, -2, -1, 0],
      };
    } else {
      const min = Math.round(dMin - 1);
      const max = Math.round(dMax + 1);
      return {
        min,
        max,
        ticks: [min, dMin, dMin + Math.round((dMax - dMin) / 2) ,dMax, max],
      };
    }
  }

  // 相差 9 / 10
  if (dMax - dMin === 9 || dMax - dMin === 10) {
    if (dMin >= 0 && dMin < 1) {
      // 值域两端接近 0，则不跨越 0
      return {
        min: 0,
        max: 10,
        ticks: [0, 2, 4, 6, 8, 10],
      };
    } else if (dMax > -1 && dMax <= 0) {
      // 值域两端接近 0，则不跨越 0
      return {
        min: -10,
        max: 0,
        ticks: [-10, -8, -6, -4, -2, 0],
      };
    // } else {
    //   const min = Math.round(dMin - 1);
    //   const max = Math.round(dMax - 1);
    //   return {
    //     min,
    //     max,
    //     ticks: [min, dMin, Math.round((dMax - dMin) / 2) ,dMax, max],
    //   };
    }
  }

  return undefined;
}

function strictLimit(cfg: ScaleConfig, ticks: number[]): number[] {
  const defaultMin = head(ticks);
  const defaultMax = last(ticks);
  const { minLimit, maxLimit, min, max, tickCount = 5 } = cfg;

  if (!isNil(minLimit) && !isNil(defaultMin) && defaultMin === minLimit && isNil(maxLimit)) {
    return ticks;
  }
  if (!isNil(maxLimit) && !isNil(defaultMax) && defaultMax === maxLimit && isNil(minLimit)) {
    return ticks;
  }

  let tickMin = isNil(minLimit) ? (isNil(defaultMin) ? min : defaultMin) : minLimit;
  let tickMax = isNil(maxLimit) ? (isNil(defaultMax) ? max : defaultMax) : maxLimit;

  if (tickMin > tickMax) {
    [tickMax, tickMin] = [tickMin, tickMax];
  }

  if (tickCount <= 2) {
    return [tickMin, tickMax];
  }

  const step = (tickMax - tickMin) / (tickCount - 1);
  const newTicks: number[] = [];

  for (let i = 0; i < tickCount; i++) {
    newTicks.push(tickMin + step * i);
  }

  return newTicks;
}
