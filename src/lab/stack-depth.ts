export type StackEvent = 'call' | 'return' | 'interrupt' | 'iret';

export interface StackSample {
  index: number;
  event: StackEvent;
  depth: number;
  valid: boolean;
}

/** Tracks logical nesting depth and flags underflow so the debugger can explain bad traces. */
export function traceStackDepth(events: StackEvent[]): StackSample[] {
  let depth = 0;
  return events.map((event, index) => {
    const decreases = event === 'return' || event === 'iret';
    if (decreases) depth -= 1;
    const valid = depth >= 0;
    if (event === 'call' || event === 'interrupt') depth += 1;
    return { index, event, depth, valid };
  });
}

export function maximumStackDepth(samples: StackSample[]): number {
  return samples.reduce((maximum, sample) => Math.max(maximum, sample.depth), 0);
}
