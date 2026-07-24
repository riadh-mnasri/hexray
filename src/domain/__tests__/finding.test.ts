import { describe, expect, it } from "vitest";
import { prioritize, type Finding } from "../finding.js";

describe("prioritize", () => {
  it("orders findings from highest to lowest severity", () => {
    // Given findings in an arbitrary severity order
    const findings: Finding[] = [
      { rule: "layering", severity: "info", file: "a.ts", message: "info finding" },
      { rule: "layering", severity: "error", file: "b.ts", message: "error finding" },
      { rule: "layering", severity: "warning", file: "c.ts", message: "warning finding" },
    ];

    // When prioritizing them
    const result = prioritize(findings);

    // Then errors come first, then warnings, then info
    expect(result.map((f) => f.severity)).toEqual(["error", "warning", "info"]);
  });
});
