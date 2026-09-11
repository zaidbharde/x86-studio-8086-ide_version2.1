export type CpuFlags = Partial<Record<'carry' | 'zero' | 'sign' | 'overflow' | 'parity', boolean>>;

export interface FlagTransition {
  index: number;
  changed: Array<keyof CpuFlags>;
  before: CpuFlags;
  after: CpuFlags;
}

const FLAG_NAMES: Array<keyof CpuFlags> = ['carry', 'zero', 'sign', 'overflow', 'parity'];

/** Returns only the flag changes in a trace, preserving the original snapshots. */
export function diffFlagTrace(trace: CpuFlags[]): FlagTransition[] {
  const transitions: FlagTransition[] = [];
  for (let index = 1; index < trace.length; index += 1) {
    const before = { ...trace[index - 1] };
    const after = { ...trace[index] };
    const changed = FLAG_NAMES.filter((name) => before[name] !== after[name]);
    if (changed.length > 0) transitions.push({ index, changed, before, after });
  }
  return transitions;
}

export function summarizeFlagActivity(trace: CpuFlags[]): Record<string, number> {
  return Object.fromEntries(
    FLAG_NAMES.map((name) => [name, diffFlagTrace(trace).filter((item) => item.changed.includes(name)).length]),
  );
}
