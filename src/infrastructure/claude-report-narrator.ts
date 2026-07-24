import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import type { Finding } from "../domain/finding.js";
import type { NarrativeReport, ReportNarrator } from "../application/ports.js";

const narrativeReportSchema = z.object({
  summary: z.string(),
  recommendations: z.array(z.string()),
});

const DEFAULT_MODEL = "claude-opus-4-8";

function buildPrompt(findings: readonly Finding[]): string {
  const countByRule = new Map<string, number>();
  for (const finding of findings) {
    countByRule.set(finding.rule, (countByRule.get(finding.rule) ?? 0) + 1);
  }
  const counts = [...countByRule.entries()]
    .map(([rule, count]) => `- ${rule}: ${count}`)
    .join("\n");
  const details = findings
    .map((finding) => `[${finding.severity}] ${finding.rule} (${finding.file}): ${finding.message}`)
    .join("\n");

  return [
    "You are auditing the architecture of a software repository.",
    "Here are the static-analysis findings, grouped by rule:",
    counts,
    "",
    "Full list of findings:",
    details,
    "",
    "Write an executive summary (2-4 sentences) of the state of the codebase's architecture,",
    "then 3-5 prioritized, concrete recommendations ordered by impact.",
    "Base your summary and recommendations strictly on the findings above; do not invent issues that are not listed.",
  ].join("\n");
}

export class ClaudeReportNarrator implements ReportNarrator {
  private readonly client = new Anthropic();
  private readonly model: string;

  constructor(model: string = process.env.HEXRAY_MODEL ?? DEFAULT_MODEL) {
    this.model = model;
  }

  async narrate(findings: readonly Finding[]): Promise<NarrativeReport> {
    if (findings.length === 0) {
      return { summary: "No architecture violations found.", recommendations: [] };
    }

    const response = await this.client.messages.parse({
      model: this.model,
      max_tokens: 2048,
      system:
        "You are a precise, concise software architecture auditor. Do not invent findings beyond what is given.",
      messages: [{ role: "user", content: buildPrompt(findings) }],
      output_config: { format: zodOutputFormat(narrativeReportSchema) },
    });

    if (!response.parsed_output) {
      throw new Error("hexray: Claude did not return a parseable report");
    }

    return response.parsed_output;
  }
}
