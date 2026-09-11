export interface RegisterSnapshot {
  [register: string]: number;
}

export interface RegisterDelta {
  register: string;
  before: number;
  after: number;
  changed: boolean;
}

function formatHex(value: number): string {
  return `0x${(value & 0xffff).toString(16).padStart(4, '0').toUpperCase()}`;
}

/** Compares two debugger snapshots and returns stable, display-ready register rows. */
export function compareRegisters(before: RegisterSnapshot, after: RegisterSnapshot): RegisterDelta[] {
  const names = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...names].sort().map((register) => ({
    register,
    before: before[register] ?? 0,
    after: after[register] ?? 0,
    changed: (before[register] ?? 0) !== (after[register] ?? 0),
  }));
}

export function formatRegisterDelta(delta: RegisterDelta): string {
  const marker = delta.changed ? '*' : ' ';
  return `${marker} ${delta.register.padEnd(4)} ${formatHex(delta.before)} -> ${formatHex(delta.after)}`;
}
