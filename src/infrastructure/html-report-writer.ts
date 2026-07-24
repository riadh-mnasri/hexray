import type { Finding } from "../domain/finding.js";
import type { NarrativeReport } from "../application/ports.js";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderHtmlReport(narrative: NarrativeReport, findings: readonly Finding[]): string {
  const findingRows = findings
    .map(
      (finding) =>
        `<tr class="severity-${escapeHtml(finding.severity)}"><td>${escapeHtml(finding.severity)}</td><td>${escapeHtml(finding.rule)}</td><td>${escapeHtml(finding.message)}</td></tr>`,
    )
    .join("\n");

  const recommendations = narrative.recommendations
    .map((recommendation) => `<li>${escapeHtml(recommendation)}</li>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Hexray architecture audit</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1rem; color: #1a1a1a; }
  h1 { font-size: 1.5rem; }
  table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
  th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #ddd; font-size: 0.9rem; }
  .severity-error { color: #b3261e; }
  .severity-warning { color: #8a5a00; }
  .severity-info { color: #444; }
</style>
</head>
<body>
<h1>Hexray architecture audit</h1>
<p>${escapeHtml(narrative.summary)}</p>
<h2>Recommendations</h2>
<ol>
${recommendations}
</ol>
<h2>Findings (${findings.length})</h2>
<table>
<thead><tr><th>Severity</th><th>Rule</th><th>Message</th></tr></thead>
<tbody>
${findingRows}
</tbody>
</table>
</body>
</html>
`;
}
