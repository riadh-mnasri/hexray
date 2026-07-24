import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { DependencyCruiserAdapter } from "../dependency-cruiser-adapter.js";

const fixturesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
  "test",
  "fixtures",
);

describe("DependencyCruiserAdapter", () => {
  it("reports no finding when the domain layer stays framework-free", async () => {
    // Given a fixture where the domain layer has no outgoing dependency
    const adapter = new DependencyCruiserAdapter();

    // When analyzing it
    const findings = await adapter.analyze(path.join(fixturesDir, "clean"));

    // Then there is nothing to report
    expect(findings).toEqual([]);
  });

  it("reports a layering violation when the domain layer imports infrastructure", async () => {
    // Given a fixture where domain/thing.ts imports infrastructure/helper.ts
    const adapter = new DependencyCruiserAdapter();

    // When analyzing it
    const findings = await adapter.analyze(path.join(fixturesDir, "layering-violation"));

    // Then the violation is reported against the offending domain file
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      rule: "no-domain-to-infrastructure",
      severity: "error",
      file: path.join("src", "domain", "thing.ts"),
    });
  });
});
