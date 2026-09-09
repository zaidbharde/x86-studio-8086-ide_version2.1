export interface TraceEvent {
  step: number;
  instruction: string;
  address: number;
  changedRegisters: string[];
  memoryWrites: number[];
}

export interface TraceQuery {
  instruction?: string;
  address?: number;
  register?: string;
  writesMemory?: boolean;
}

export function filterTrace(events: TraceEvent[], query: TraceQuery): TraceEvent[] {
  const instruction = query.instruction?.trim().toUpperCase();
  const register = query.register?.trim().toUpperCase();
  return events.filter((event) => {
    if (instruction && !event.instruction.toUpperCase().includes(instruction)) return false;
    if (query.address !== undefined && event.address !== query.address) return false;
    if (register && !event.changedRegisters.some((name) => name.toUpperCase() === register)) return false;
    if (query.writesMemory === true && event.memoryWrites.length === 0) return false;
    if (query.writesMemory === false && event.memoryWrites.length > 0) return false;
    return true;
  });
}

export function summarizeTrace(events: TraceEvent[]): { steps: number; instructions: number; writes: number; registers: string[] } {
  const instructions = new Set(events.map((event) => event.instruction.toUpperCase()));
  const registers = new Set(events.flatMap((event) => event.changedRegisters.map((name) => name.toUpperCase())));
  return {
    steps: events.length,
    instructions: instructions.size,
    writes: events.reduce((total, event) => total + event.memoryWrites.length, 0),
    registers: [...registers].sort(),
  };
}
