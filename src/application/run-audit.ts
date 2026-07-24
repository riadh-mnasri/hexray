import { prioritize, type Finding } from "../domain/finding.js";
import type { StaticAnalyzerPort } from "./ports.js";

export async function runAudit(
  targetDir: string,
  analyzers: readonly StaticAnalyzerPort[],
): Promise<Finding[]> {
  const results = await Promise.all(
    analyzers.map((analyzer) => analyzer.analyze(targetDir)),
  );
  return prioritize(results.flat());
}
