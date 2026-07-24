import { describe, expect, it } from "vitest";
import { HtmlReportGenerator } from "../html-report-generator.js";
import type { Finding } from "../../domain/finding.js";
import type { NarrativeReport, ReportNarrator } from "../../application/ports.js";

function fakeNarrator(narrative: NarrativeReport): ReportNarrator {
  return { narrate: async () => narrative };
}

describe("HtmlReportGenerator", () => {
  it("renders the narrator's output into an HTML report", async () => {
    // Given a narrator that returns a fixed narrative
    const findings: Finding[] = [{ rule: "r", severity: "error", file: "a.ts", message: "m" }];
    const generator = new HtmlReportGenerator(
      fakeNarrator({ summary: "All good.", recommendations: ["Do X."] }),
    );

    // When generating the report
    const html = await generator.generate(findings);

    // Then it contains the narrator's content
    expect(html).toContain("All good.");
    expect(html).toContain("Do X.");
  });
});
