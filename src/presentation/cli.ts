#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { runAudit } from "../application/run-audit.js";
import type { ReportGenerator, StaticAnalyzerPort } from "../application/ports.js";
import { DependencyCruiserAdapter } from "../infrastructure/dependency-cruiser-adapter.js";
import { ClaudeReportNarrator } from "../infrastructure/claude-report-narrator.js";
import { HtmlReportGenerator } from "../infrastructure/html-report-generator.js";

const analyzers: StaticAnalyzerPort[] = [new DependencyCruiserAdapter()];
const reportGenerator: ReportGenerator = new HtmlReportGenerator(new ClaudeReportNarrator());

async function main(): Promise<void> {
  const targetDir = process.argv[2] ?? process.cwd();

  const findings = await runAudit(targetDir, analyzers);

  if (findings.length === 0) {
    console.log("hexray: no findings.");
    return;
  }

  const html = await reportGenerator.generate(findings, targetDir);
  const outputPath = path.join(targetDir, "hexray-report.html");
  await writeFile(outputPath, html, "utf8");
  console.log(`hexray: wrote report to ${outputPath}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
