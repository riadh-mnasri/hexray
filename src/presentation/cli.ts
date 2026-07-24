#!/usr/bin/env node
import { runAudit } from "../application/run-audit.js";
import type { StaticAnalyzerPort } from "../application/ports.js";
import { DependencyCruiserAdapter } from "../infrastructure/dependency-cruiser-adapter.js";

const analyzers: StaticAnalyzerPort[] = [new DependencyCruiserAdapter()];

async function main(): Promise<void> {
  const targetDir = process.argv[2] ?? process.cwd();

  const findings = await runAudit(targetDir, analyzers);

  if (findings.length === 0) {
    console.log("hexray: no findings.");
    return;
  }

  console.log(JSON.stringify(findings, null, 2));
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
