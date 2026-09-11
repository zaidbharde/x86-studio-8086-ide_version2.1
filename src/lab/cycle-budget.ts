export interface CycleRule {
  mnemonic: string;
  base: number;
  perMemoryOperand?: number;
  branchPenalty?: number;
}

export interface InstructionCost {
  mnemonic: string;
  cycles: number;
  explanation: string;
}

/** Estimates relative 8086 cycle cost without pretending to replace a hardware datasheet. */
export function estimateCycles(
  instructions: Array<{ mnemonic: string; memoryOperands?: number; branchTaken?: boolean }>,
  rules: CycleRule[],
): InstructionCost[] {
  const table = new Map(rules.map((rule) => [rule.mnemonic.toUpperCase(), rule]));
  return instructions.map((instruction) => {
    const key = instruction.mnemonic.toUpperCase();
    const rule = table.get(key) ?? { mnemonic: key, base: 1 };
    const memory = (instruction.memoryOperands ?? 0) * (rule.perMemoryOperand ?? 0);
    const branch = instruction.branchTaken ? rule.branchPenalty ?? 0 : 0;
    const cycles = rule.base + memory + branch;
    return {
      mnemonic: key,
      cycles,
      explanation: `${rule.base} base + ${memory} memory + ${branch} branch penalty`,
    };
  });
}
