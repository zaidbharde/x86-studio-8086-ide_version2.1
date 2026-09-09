export interface MemoryAccess {
  address: number;
  kind: 'read' | 'write' | 'execute';
  step: number;
}

export interface MemoryHeatCell {
  page: number;
  reads: number;
  writes: number;
  executes: number;
  total: number;
  intensity: number;
}

export function buildMemoryHeatmap(accesses: MemoryAccess[], pageSize = 256): MemoryHeatCell[] {
  if (!Number.isInteger(pageSize) || pageSize <= 0) throw new Error('pageSize must be positive');
  const cells = new Map<number, MemoryHeatCell>();
  for (const access of accesses) {
    if (!Number.isInteger(access.address) || access.address < 0) continue;
    const page = Math.floor(access.address / pageSize);
    const cell = cells.get(page) ?? { page, reads: 0, writes: 0, executes: 0, total: 0, intensity: 0 };
    cell[`${access.kind}s` as 'reads' | 'writes' | 'executes'] += 1;
    cell.total += 1;
    cells.set(page, cell);
  }
  const maximum = Math.max(1, ...[...cells.values()].map((cell) => cell.total));
  return [...cells.values()]
    .map((cell) => ({ ...cell, intensity: Number((cell.total / maximum).toFixed(3)) }))
    .sort((left, right) => left.page - right.page);
}

export function busiestPages(cells: MemoryHeatCell[], limit = 5): MemoryHeatCell[] {
  return [...cells].sort((left, right) => right.total - left.total || left.page - right.page).slice(0, Math.max(0, limit));
}

export function addressRangeForPage(page: number, pageSize = 256): { start: number; end: number } {
  if (!Number.isInteger(page) || page < 0) throw new Error('page must be non-negative');
  return { start: page * pageSize, end: (page + 1) * pageSize - 1 };
}
