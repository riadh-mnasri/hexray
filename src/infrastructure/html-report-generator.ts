import type { Finding } from "../domain/finding.js";
import type { ReportGenerator, ReportNarrator } from "../application/ports.js";
import { renderHtmlReport } from "./html-report-writer.js";

export class HtmlReportGenerator implements ReportGenerator {
  constructor(private readonly narrator: ReportNarrator) {}

  async generate(findings: readonly Finding[]): Promise<string> {
    const narrative = await this.narrator.narrate(findings);
    return renderHtmlReport(narrative, findings);
  }
}
