export type AccessKind = 'read' | 'write' | 'execute';

export interface MemoryAccess {
  address: number;
  kind: AccessKind;
  cycle: number;
  label?: string;
}

export interface TimelineBucket {
  cycle: number;
  accesses: MemoryAccess[];
  touchedPages: number[];
}

/** Groups memory events by cycle and records the 8086-sized 256-byte pages touched. */
export function buildAccessTimeline(events: MemoryAccess[]): TimelineBucket[] {
  const buckets = new Map<number, TimelineBucket>();
  for (const event of events) {
    if (!Number.isInteger(event.address) || event.address < 0 || event.address > 0xffff) {
      throw new RangeError(`Address outside 8086 memory: ${event.address}`);
    }
    const bucket = buckets.get(event.cycle) ?? {
      cycle: event.cycle,
      accesses: [],
      touchedPages: [],
    };
    bucket.accesses.push({ ...event });
    const page = event.address >>> 8;
    if (!bucket.touchedPages.includes(page)) bucket.touchedPages.push(page);
    buckets.set(event.cycle, bucket);
  }
  return [...buckets.values()]
    .sort((left, right) => left.cycle - right.cycle)
    .map((bucket) => ({ ...bucket, touchedPages: bucket.touchedPages.sort((a, b) => a - b) }));
}
