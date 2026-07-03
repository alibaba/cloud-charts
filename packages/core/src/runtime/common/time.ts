export function getHourlyTimestamp(timestamp: number): number {
  const date = new Date(timestamp);
  date.setMinutes(0, 0, 0);
  return date.getTime();
}

export function generateTimestamps(
  start: number,
  end: number,
  interval: number,
  showLast?: boolean,
  showInteger?: boolean,
): number[] {
  const timestamps: number[] = [];
  const normalizedStart = showInteger ? getHourlyTimestamp(start) : start;
  const normalizedEnd = showInteger ? getHourlyTimestamp(end) : end;

  for (let timestamp = normalizedStart; timestamp <= normalizedEnd; timestamp += interval) {
    timestamps.push(timestamp);
  }

  if (showLast && !timestamps.includes(end) && end) {
    timestamps.push(end);
  }

  return timestamps;
}
