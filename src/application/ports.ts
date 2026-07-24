import type { Finding } from "../domain/finding.js";

export interface StaticAnalyzerPort {
  readonly name: string;
  analyze(targetDir: string): Promise<Finding[]>;
}

export interface ReportGenerator {
  generate(findings: readonly Finding[], targetDir: string): Promise<string>;
}
