export interface ContributionProbe {
  repository: string;
  commitCount: number;
  authorEmail: string;
  observedAt: string;
}

export function createContributionProbe(repository: string, commitCount: number, authorEmail: string): ContributionProbe {
  if (!repository.trim()) throw new Error('repository is required');
  if (!Number.isInteger(commitCount) || commitCount < 1) throw new Error('commitCount must be positive');
  if (!authorEmail.includes('@')) throw new Error('authorEmail must be valid');
  return { repository, commitCount, authorEmail, observedAt: new Date().toISOString() };
}

export function summarizeProbes(probes: ContributionProbe[]): string {
  return probes.map((probe) => `${probe.repository}: ${probe.commitCount} commits by ${probe.authorEmail}`).join('\n');
}
