import type { Finding } from "../domain/finding.js";

export interface StaticAnalyzerPort {
  readonly name: string;
  analyze(targetDir: string): Promise<Finding[]>;
}

export interface ReportGenerator {
  generate(findings: readonly Finding[], targetDir: string): Promise<string>;
}

export interface NarrativeReport {
  readonly summary: string;
  readonly recommendations: readonly string[];
}

export interface ReportNarrator {
  narrate(findings: readonly Finding[]): Promise<NarrativeReport>;
}
