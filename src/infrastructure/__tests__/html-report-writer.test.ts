import { describe, expect, it } from "vitest";
import { renderHtmlReport } from "../html-report-writer.js";
import type { Finding } from "../../domain/finding.js";

describe("renderHtmlReport", () => {
  it("embeds the narrative summary, recommendations, and findings in the HTML", () => {
    // Given a narrative and a finding
    const findings: Finding[] = [
      {
        rule: "no-domain-to-infrastructure",
        severity: "error",
        file: "src/domain/thing.ts",
        message: "boom",
      },
    ];
    const narrative = {
      summary: "One layering violation found.",
      recommendations: ["Extract an interface."],
    };

    // When rendering the HTML report
    const html = renderHtmlReport(narrative, findings);

    // Then it is a self-contained document containing the narrative and the finding
    expect(html).toContain("<!doctype html>");
    expect(html).toContain("One layering violation found.");
    expect(html).toContain("Extract an interface.");
    expect(html).toContain("no-domain-to-infrastructure");
  });

  it("escapes HTML-significant characters in finding messages", () => {
    // Given a finding whose message contains HTML-significant characters
    const findings: Finding[] = [
      { rule: "r", severity: "warning", file: "a.ts", message: "<script>alert(1)</script>" },
    ];
    const narrative = { summary: "s", recommendations: [] };

    // When rendering
    const html = renderHtmlReport(narrative, findings);

    // Then the raw tag never appears unescaped
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
