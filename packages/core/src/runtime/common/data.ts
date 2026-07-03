export interface DataIndexColorRecord {
  name?: string;
  yAxis?: number;
  [key: string]: unknown;
}

export type ColorResolver = string | string[] | ((name: string | undefined) => string);

export function getDataIndexColor(
  colors: ColorResolver | undefined,
  rawData: DataIndexColorRecord[],
  dataIndex: number,
): string | undefined {
  if (typeof colors === 'string') {
    return colors;
  }

  const colorIndex = rawData.findIndex((record) => (record.yAxis || 0) === dataIndex);
  if (colorIndex < 0) {
    return undefined;
  }

  if (Array.isArray(colors)) {
    return colors[colorIndex];
  }

  if (typeof colors === 'function') {
    return colors(rawData[colorIndex]?.name);
  }

  return undefined;
}

function calculateAverageDifference(chartData: number[]): number {
  let sumOfDifferences = 0;
  for (let index = 1; index < chartData.length; index += 1) {
    sumOfDifferences += Math.abs(chartData[index] - chartData[index - 1]);
  }
  return chartData.length > 1 ? sumOfDifferences / (chartData.length - 1) : 0;
}

export function sampleDataWithNoise(chartData: number[], sampleRate = 0.5): number[] {
  if (sampleRate <= 0 || sampleRate > 1) {
    throw new Error('Sample rate must be between 0 and 1.');
  }

  if (sampleRate >= 1) {
    return [...chartData];
  }

  const averageDifference = calculateAverageDifference(chartData);
  const noiseThreshold = averageDifference * 2;
  const noiseIndexes = chartData
    .map((value, index, array) => ({
      value,
      index,
      isNoise:
        index > 0 && index < array.length - 1
          ? Math.abs(value - array[index - 1]) > noiseThreshold || Math.abs(value - array[index + 1]) > noiseThreshold
          : false,
    }))
    .filter((item) => item.isNoise)
    .map((item) => item.index);

  const sampledData: number[] = [];
  const includedNoise = new Set<number>();

  noiseIndexes.forEach((index) => {
    if (!includedNoise.has(index)) {
      sampledData.push(chartData[index]);
      includedNoise.add(index);
    }
  });

  chartData.forEach((value, index) => {
    if (!includedNoise.has(index) && Math.random() < sampleRate) {
      sampledData.push(value);
    }
  });

  return sampledData;
}

export type TimestampDataPoint = [number, number | null];
export interface TimestampSeriesInput {
  name: string;
  data: Array<[number, number]>;
}
export interface TimestampSeriesOutput {
  name: string;
  data: TimestampDataPoint[];
}

export function fillMissingTimestamps(
  input: TimestampSeriesInput[],
  fillValue: null | 0 = null,
  tickInterval?: number,
): TimestampSeriesOutput[] {
  const allTimestamps = input.reduce<number[]>((timestamps, series) => {
    series.data.forEach((datum) => timestamps.push(datum[0]));
    return timestamps;
  }, []);
  const sortedTimestamps = [...new Set(allTimestamps)].sort((left, right) => left - right);

  let minInterval = Infinity;
  if (tickInterval) {
    minInterval = tickInterval;
  } else {
    for (let index = 1; index < sortedTimestamps.length; index += 1) {
      minInterval = Math.min(minInterval, sortedTimestamps[index] - sortedTimestamps[index - 1]);
    }
  }

  const start = Math.min(...sortedTimestamps);
  const end = Math.max(...sortedTimestamps);
  const completeTimestamps: number[] = [];
  for (let timestamp = start; timestamp <= end; timestamp += minInterval || 1) {
    completeTimestamps.push(timestamp);
  }

  return input.map((series) => {
    const valueMap = new Map(series.data.map(([timestamp, value]) => [timestamp, value]));
    return {
      name: series.name,
      data: completeTimestamps.map((timestamp) => [timestamp, valueMap.get(timestamp) ?? fillValue]),
    };
  });
}
