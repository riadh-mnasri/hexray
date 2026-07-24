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
  infrastructure/    concrete adapters (ESLint, dependency-cruiser, Detekt, ArchUnit...)
  presentation/       CLI entry point
```

The domain never knows about a concrete analysis tool: each third-party tool is plugged in behind `StaticAnalyzerPort`.

## Install

```bash
npm install
```

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

```bash
npx hexray ./path/to/a/repo
```

Current status: layering violation and dependency cycle detection for TypeScript (via dependency-cruiser). No Kotlin support yet, and no HTML report yet.

## Roadmap

- [x] dependency-cruiser adapter (layering violations, cycles, TypeScript)
- [ ] Detekt / ArchUnit adapter (Kotlin)
- [ ] Dependency freshness adapter (npm audit, Gradle)
- [ ] Agent-backed report generator (executive summary, prioritized recommendations)
- [ ] Self-contained HTML report

## License

MIT

---

© 2026 Riadh MNASRI
