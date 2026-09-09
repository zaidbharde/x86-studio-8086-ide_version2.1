export interface ContributionWindow {
  start: Date;
  end: Date;
}

export function utcDayWindow(reference: Date): ContributionWindow {
  const start = new Date(reference);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export function containsTimestamp(window: ContributionWindow, timestamp: string): boolean {
  const value = Date.parse(timestamp);
  return Number.isFinite(value) && value >= window.start.getTime() && value < window.end.getTime();
}

export function formatWindow(window: ContributionWindow): string {
  return `${window.start.toISOString()}..${window.end.toISOString()}`;
}
