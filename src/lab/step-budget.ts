export interface StepBudget {
  limit: number;
  consumed: number;
}

export type BudgetResult =
  | { status: 'continue'; remaining: number }
  | { status: 'exhausted'; consumed: number };

export function createStepBudget(limit: number): StepBudget {
  if (!Number.isInteger(limit) || limit < 1) throw new Error('step limit must be a positive integer');
  return { limit, consumed: 0 };
}

export function consumeStep(budget: StepBudget, amount = 1): BudgetResult {
  if (!Number.isInteger(amount) || amount < 1) throw new Error('amount must be a positive integer');
  budget.consumed += amount;
  return budget.consumed >= budget.limit
    ? { status: 'exhausted', consumed: budget.consumed }
    : { status: 'continue', remaining: budget.limit - budget.consumed };
}

export function resetStepBudget(budget: StepBudget, limit = budget.limit): void {
  if (!Number.isInteger(limit) || limit < 1) throw new Error('step limit must be a positive integer');
  budget.limit = limit;
  budget.consumed = 0;
}

export function budgetProgress(budget: StepBudget): number {
  return Math.min(1, budget.consumed / budget.limit);
}
