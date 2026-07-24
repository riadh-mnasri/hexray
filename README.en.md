# Hexray

[Version française](./README.md)

A command-line tool that audits the architecture of a TypeScript or Kotlin project: layering violations (domain/infrastructure), dependency cycles, test pyramid ratio, dependency freshness. It produces a self-contained HTML report, designed to be readable by a client or a recruiter in a few seconds.

## Why

Most static analysis tools produce lists of raw metrics. Hexray aggregates them, prioritizes them, then has an agent synthesize them into an executive summary with recommendations, in the format of a real audit deliverable.

## Stack

- TypeScript, Node.js
- Vitest for tests (Given/When/Then convention)
- tsup for the build
- Hexagonal architecture: pure domain, ports/adapters for external analysis tools

## Architecture

```
src/
  domain/          Finding, severity-based prioritization (no external dependency)
  application/      RunAudit use case, ports (StaticAnalyzerPort, ReportGenerator)
  infrastructure/    concrete adapters (dependency-cruiser, Claude for narrative synthesis, HTML report, Detekt/ArchUnit coming...)
  presentation/       CLI entry point
```

The domain never knows about a concrete analysis tool: each third-party tool is plugged in behind `StaticAnalyzerPort`.

## Install

```bash
npm install
```

## Environment variables

- `ANTHROPIC_API_KEY` (required to generate the report): Claude API key, used to synthesize findings into an executive summary.
- `HEXRAY_MODEL` (optional): Claude model ID to use, defaults to `claude-opus-4-8`.

## Development

```bash
npm run test        # run tests once
npm run test:watch  # tests in watch mode
npm run typecheck
npm run lint
npm run build
```

No dev server or port involved: Hexray is a CLI tool, not a web application.

## Usage

Hexray is not published on npm yet: for now, build and run it locally (see the roadmap).

### 1. Clone and build

```bash
git clone https://github.com/riadh-mnasri/hexray.git
cd hexray
npm install
npm run build
```

### 2. Set the API key

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Optional, to switch models:

```bash
export HEXRAY_MODEL=claude-sonnet-5
```

### 3. Run the audit

The argument is the path to the root of the project to audit (the one containing its `src/` folder):

```bash
node dist/cli.js /path/to/the/project/to/audit
```

To use it as a command while developing:

```bash
npm link
hexray /path/to/the/project/to/audit
```

### 4. Read the result

- No violation found: `hexray: no findings.` is printed, and no call is made to the Claude API (so no cost).
- Violations found: a `hexray-report.html` file is written to the root of the audited project (executive summary, prioritized recommendations, then the detail of each finding). Open it in a browser.

### Example, on the test fixture shipped with the repo

```bash
node dist/cli.js test/fixtures/layering-violation
# hexray: wrote report to test/fixtures/layering-violation/hexray-report.html
```

Current status: layering violation and dependency cycle detection for TypeScript (via dependency-cruiser), Claude-backed synthesis, and HTML report. No Kotlin support yet.

## Roadmap

- [x] dependency-cruiser adapter (layering violations, cycles, TypeScript)
- [x] Agent-backed report generator (executive summary, prioritized recommendations)
- [x] Self-contained HTML report
- [ ] Detekt / ArchUnit adapter (Kotlin)
- [ ] Dependency freshness adapter (npm audit, Gradle)
- [ ] Publish to npm (to enable `npx hexray`)

## License

MIT

---

© 2026 Riadh MNASRI
