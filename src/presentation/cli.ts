#!/usr/bin/env node
import { runAudit } from "../application/run-audit.js";
import type { StaticAnalyzerPort } from "../application/ports.js";

const analyzers: StaticAnalyzerPort[] = [];

async function main(): Promise<void> {
  const targetDir = process.argv[2] ?? process.cwd();

  if (analyzers.length === 0) {
    console.log(
      "hexray: no analyzers registered yet. See infrastructure/ for adapters to implement (ESLint, dependency-cruiser, Detekt, ArchUnit).",
    );
    return;
  }

  const findings = await runAudit(targetDir, analyzers);
  console.log(JSON.stringify(findings, null, 2));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
