export type RegisterWidth = 8 | 16;

export interface RegisterDisplay {
  name: string;
  value: number;
  hexadecimal: string;
  binary: string;
  width: RegisterWidth;
}

const MASKS: Record<RegisterWidth, number> = { 8: 0xff, 16: 0xffff };

function pad(value: string, width: number): string {
  return value.padStart(width, '0');
}

export function formatRegister(name: string, value: number, width: RegisterWidth = 16): RegisterDisplay {
  const masked = value & MASKS[width];
  return {
    name: name.toUpperCase(),
    value: masked,
    hexadecimal: `0x${pad(masked.toString(16).toUpperCase(), width / 4)}`,
    binary: pad(masked.toString(2), width),
    width,
  };
}

export function formatRegisterTable(registers: Record<string, number>): RegisterDisplay[] {
  return Object.entries(registers)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => formatRegister(name, value));
}

export function parseRegisterValue(input: string, width: RegisterWidth = 16): number | null {
  const normalized = input.trim().replace(/^#/, '');
  if (!normalized) return null;
  const radix = normalized.startsWith('0x') ? 16 : normalized.startsWith('0b') ? 2 : 10;
  const digits = radix === 16 || radix === 2 ? normalized.slice(2) : normalized;
  if (!digits || !/^[0-9a-f]+$/i.test(digits)) return null;
  const parsed = Number.parseInt(digits, radix);
  return Number.isFinite(parsed) ? parsed & MASKS[width] : null;
}

export function changedRegisters(before: Record<string, number>, after: Record<string, number>): string[] {
  const names = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...names].filter((name) => (before[name] ?? 0) !== (after[name] ?? 0)).sort();
}
