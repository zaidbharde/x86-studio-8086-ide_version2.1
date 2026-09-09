export interface BranchSample {
  instruction: string;
  taken: boolean;
  target: number;
}

export interface BranchOutcome {
  instruction: string;
  total: number;
  taken: number;
  notTaken: number;
  takenRate: number;
  targets: number[];
}

export function analyzeBranchOutcomes(samples: BranchSample[]): BranchOutcome[] {
  const grouped = new Map<string, BranchOutcome>();
  for (const sample of samples) {
    const instruction = sample.instruction.toUpperCase();
    const current = grouped.get(instruction) ?? {
      instruction, total: 0, taken: 0, notTaken: 0, takenRate: 0, targets: [],
    };
    current.total += 1;
    if (sample.taken) current.taken += 1;
    else current.notTaken += 1;
    if (!current.targets.includes(sample.target)) current.targets.push(sample.target);
    current.takenRate = Number((current.taken / current.total).toFixed(3));
    grouped.set(instruction, current);
  }
  return [...grouped.values()].sort((left, right) => right.total - left.total || left.instruction.localeCompare(right.instruction));
}

export function predictMajority(outcome: BranchOutcome): boolean {
  return outcome.taken >= outcome.notTaken;
}
