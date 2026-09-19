export interface CpuFlags {
  carry: boolean;
  parity: boolean;
  auxiliary: boolean;
  zero: boolean;
  sign: boolean;
  trap: boolean;
  interrupt: boolean;
  direction: boolean;
  overflow: boolean;
}

const FLAG_BITS: Array<[keyof CpuFlags, number]> = [
  ["carry", 0], ["parity", 2], ["auxiliary", 4], ["zero", 6], ["sign", 7],
  ["trap", 8], ["interrupt", 9], ["direction", 10], ["overflow", 11],
];

export const emptyFlags = (): CpuFlags => Object.fromEntries(
  FLAG_BITS.map(([name]) => [name, false]),
) as CpuFlags;

export function packFlags(flags: CpuFlags): number {
  return FLAG_BITS.reduce((value, [name, bit]) => value | (flags[name] ? 1 << bit : 0), 0x0002);
}

export function unpackFlags(value: number): CpuFlags {
  const flags = emptyFlags();
  for (const [name, bit] of FLAG_BITS) flags[name] = (value & (1 << bit)) !== 0;
  return flags;
}

export function updateZeroSign(flags: CpuFlags, result: number, width: 8 | 16): CpuFlags {
  const mask = width === 8 ? 0xff : 0xffff;
  const normalized = result & mask;
  return { ...flags, zero: normalized === 0, sign: (normalized & (1 << (width - 1))) !== 0 };
}
