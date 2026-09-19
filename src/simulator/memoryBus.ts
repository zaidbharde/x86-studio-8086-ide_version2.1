export class MemoryBus {
  private readonly bytes: Uint8Array;

  constructor(public readonly size = 0x10000) {
    if (!Number.isInteger(size) || size < 256) throw new Error("Memory must contain at least 256 bytes");
    this.bytes = new Uint8Array(size);
  }

  private address(value: number): number {
    if (!Number.isInteger(value) || value < 0 || value >= this.size) {
      throw new RangeError(`Address outside memory: ${value}`);
    }
    return value;
  }

  read8(address: number): number { return this.bytes[this.address(address)]; }

  read16(address: number): number {
    const low = this.read8(address);
    const high = this.read8(this.address(address + 1));
    return low | (high << 8);
  }

  write8(address: number, value: number): void {
    this.bytes[this.address(address)] = value & 0xff;
  }

  write16(address: number, value: number): void {
    this.write8(address, value);
    this.write8(this.address(address + 1), value >>> 8);
  }

  load(start: number, data: ArrayLike<number>): void {
    for (let index = 0; index < data.length; index += 1) this.write8(start + index, data[index]);
  }

  dump(start: number, length: number): number[] {
    if (!Number.isInteger(length) || length < 0) throw new RangeError("Dump length must be non-negative");
    return Array.from({ length }, (_, index) => this.read8(start + index));
  }

  clear(): void { this.bytes.fill(0); }
}
