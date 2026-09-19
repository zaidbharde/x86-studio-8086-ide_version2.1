export interface TraceEntry {
  address: number;
  instruction: string;
  cycles: number;
  registers: Readonly<Record<string, number>>;
}

export class TraceBuffer {
  private readonly entries: TraceEntry[] = [];

  constructor(private readonly capacity = 256) {
    if (!Number.isInteger(capacity) || capacity < 1) throw new Error("Trace capacity must be positive");
  }

  record(entry: TraceEntry): void {
    this.entries.push({ ...entry, registers: { ...entry.registers } });
    if (this.entries.length > this.capacity) this.entries.shift();
  }

  recent(count = this.entries.length): TraceEntry[] {
    const start = Math.max(0, this.entries.length - Math.max(0, count));
    return this.entries.slice(start).map((entry) => ({ ...entry, registers: { ...entry.registers } }));
  }

  find(address: number): TraceEntry | undefined {
    for (let index = this.entries.length - 1; index >= 0; index -= 1) {
      if (this.entries[index].address === address) return this.entries[index];
    }
    return undefined;
  }

  clear(): void { this.entries.length = 0; }
  get size(): number { return this.entries.length; }
}
