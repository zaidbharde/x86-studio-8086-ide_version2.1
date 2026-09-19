export interface Breakpoint {
  id: string;
  start: number;
  end?: number;
  label?: string;
  enabled: boolean;
}

export interface ExecutionLocation {
  address: number;
  label?: string;
}

export function matchesBreakpoint(breakpoint: Breakpoint, location: ExecutionLocation): boolean {
  if (!breakpoint.enabled) return false;
  const upperBound = breakpoint.end ?? breakpoint.start;
  const inRange = location.address >= breakpoint.start && location.address <= upperBound;
  const labelMatches = !breakpoint.label || breakpoint.label === location.label;
  return inRange && labelMatches;
}

export function findBreakpoint(
  breakpoints: readonly Breakpoint[],
  location: ExecutionLocation,
): Breakpoint | undefined {
  return breakpoints.find((breakpoint) => matchesBreakpoint(breakpoint, location));
}

export function normalizeBreakpoint(input: Omit<Breakpoint, "enabled"> & Partial<Pick<Breakpoint, "enabled">>): Breakpoint {
  const start = Math.max(0, Math.min(0xffff, Math.trunc(input.start)));
  const end = input.end === undefined ? undefined : Math.max(start, Math.min(0xffff, Math.trunc(input.end)));
  return { ...input, start, end, enabled: input.enabled ?? true };
}
