import path from "node:path";
import { cruise, type ICruiseResult } from "dependency-cruiser";
import type { Finding, Severity } from "../domain/finding.js";
import type { StaticAnalyzerPort } from "../application/ports.js";

interface DependencyCruiserViolation {
  readonly type: string;
  readonly from: string;
  readonly to: string;
  readonly rule: { readonly name: string; readonly severity?: string };
}

interface CruiseSummary {
  readonly violations: readonly DependencyCruiserViolation[];
}

const severityByDependencyCruiserSeverity: Record<string, Severity> = {
  error: "error",
  warn: "warning",
  info: "info",
};

const forbiddenRules = [
  {
    name: "no-domain-to-infrastructure",
    severity: "error" as const,
    comment:
      "The domain layer must stay framework-free: it cannot depend on infrastructure or presentation adapters.",
    from: { path: "(^|/)src/domain(/|$)" },
    to: { path: "(^|/)src/(infrastructure|presentation)(/|$)" },
  },
  {
    name: "no-domain-to-application",
    severity: "error" as const,
    comment:
      "Dependencies point inward: the domain layer must not depend on application use cases.",
    from: { path: "(^|/)src/domain(/|$)" },
    to: { path: "(^|/)src/application(/|$)" },
  },
  {
    name: "no-circular",
    severity: "warn" as const,
    comment: "Circular dependencies make modules hard to reason about and to test in isolation.",
    from: {},
    to: { circular: true },
  },
];

function relativeToTarget(cwdRelativePath: string, targetDir: string): string {
  return path.relative(targetDir, path.resolve(process.cwd(), cwdRelativePath));
}

function toFinding(violation: DependencyCruiserViolation, targetDir: string): Finding {
  const relativeFrom = relativeToTarget(violation.from, targetDir);
  const relativeTo = relativeToTarget(violation.to, targetDir);
  const severity = severityByDependencyCruiserSeverity[violation.rule.severity ?? "error"] ?? "error";

  return {
    rule: violation.rule.name,
    severity,
    file: relativeFrom,
    message: `${relativeFrom} -> ${relativeTo} (${violation.type})`,
  };
}

export class DependencyCruiserAdapter implements StaticAnalyzerPort {
  readonly name = "dependency-cruiser";

  async analyze(targetDir: string): Promise<Finding[]> {
    const result = await cruise([path.join(targetDir, "src")], {
      outputType: "json",
      validate: true,
      exclude: "(^|/)(node_modules|__tests__)/|\\.test\\.ts$",
      ruleSet: { forbidden: forbiddenRules },
    });

    const output: ICruiseResult =
      typeof result.output === "string" ? JSON.parse(result.output) : result.output;
    const violations = (output.summary as unknown as CruiseSummary).violations;

    return violations.map((violation) => toFinding(violation, targetDir));
  }
}
