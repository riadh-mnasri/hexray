import { describe, expect, it } from "vitest";
import { runAudit } from "../run-audit.js";
import type { StaticAnalyzerPort } from "../ports.js";
import type { Finding } from "../../domain/finding.js";

function fakeAnalyzer(name: string, findings: Finding[]): StaticAnalyzerPort {
  return {
    name,
    analyze: async () => findings,
  };
}

describe("runAudit", () => {
  it("aggregates findings from every analyzer and prioritizes them", async () => {
    // Given two analyzers each reporting a finding of different severity
    const analyzers = [
      fakeAnalyzer("eslint", [
        { rule: "layering", severity: "info", file: "a.ts", message: "info finding" },
      ]),
      fakeAnalyzer("dependency-cruiser", [
        { rule: "cycle", severity: "error", file: "b.ts", message: "cyclic import" },
      ]),
    ];

    // When running the audit
    const findings = await runAudit("/some/repo", analyzers);

    // Then all findings are present, ordered by severity
    expect(findings).toHaveLength(2);
    expect(findings[0]?.severity).toBe("error");
    expect(findings[1]?.severity).toBe("info");
  });

  it("returns no findings when no analyzer is registered", async () => {
    // Given no analyzers configured yet
    // When running the audit
    const findings = await runAudit("/some/repo", []);

    // Then the result is empty, not an error
    expect(findings).toEqual([]);
  });
});
