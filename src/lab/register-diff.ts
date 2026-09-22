export interface RegisterState {
  [register: string]: number;
}

export interface RegisterChange {
  register: string;
  before: number | undefined;
  after: number | undefined;
  delta: number | undefined;
}

export function diffRegisters(before: RegisterState, after: RegisterState): RegisterChange[] {
  const names = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...names].sort().flatMap((register) => {
    const previous = before[register];
    const next = after[register];
    if (previous === next) return [];
    return [{
      register,
      before: previous,
      after: next,
      delta: previous === undefined || next === undefined ? undefined : next - previous,
    }];
  });
}

export function changedRegisterCount(before: RegisterState, after: RegisterState): number {
  return diffRegisters(before, after).length;
}
