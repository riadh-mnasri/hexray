export type Severity = "info" | "warning" | "error";

export interface Finding {
  readonly rule: string;
  readonly severity: Severity;
  readonly file: string;
  readonly message: string;
}

const severityWeight: Record<Severity, number> = {
  error: 2,
  warning: 1,
  info: 0,
};

export function prioritize(findings: readonly Finding[]): Finding[] {
  return [...findings].sort(
    (a, b) => severityWeight[b.severity] - severityWeight[a.severity],
  );
}
