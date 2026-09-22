export interface LatencySample {
  label: string;
  cycles: number;
}

export interface LatencyBucket {
  label: string;
  count: number;
  minimum: number;
  maximum: number;
  average: number;
}

export function summarizeLatency(samples: LatencySample[], boundaries: number[]): LatencyBucket[] {
  const sorted = [...boundaries].filter(Number.isFinite).sort((a, b) => a - b);
  const buckets = sorted.map((boundary, index) => ({
    label: index === 0 ? `<=${boundary}` : `>${sorted[index - 1]}-${boundary}`,
    values: [] as number[],
  }));
  const overflow = { label: `>${sorted.at(-1) ?? 0}`, values: [] as number[] };
  for (const sample of samples) {
    const target = buckets.find((bucket, index) => sample.cycles <= sorted[index]);
    (target ?? overflow).values.push(sample.cycles);
  }
  return [...buckets, overflow].filter(({ values }) => values.length > 0).map(({ label, values }) => ({
    label,
    count: values.length,
    minimum: Math.min(...values),
    maximum: Math.max(...values),
    average: values.reduce((total, value) => total + value, 0) / values.length,
  }));
}
