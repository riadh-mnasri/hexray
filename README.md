# Hexray

[English version](./README.en.md)

Outil en ligne de commande qui audite l'architecture d'un projet TypeScript ou Kotlin : violations de couches (domaine/infrastructure), cycles de dépendances, ratio de la pyramide de tests, fraîcheur des dépendances. Il produit un rapport HTML autonome, pensé pour être lisible par un client ou un recruteur en quelques secondes.

## Pourquoi

La plupart des outils d'analyse statique produisent des listes de métriques brutes. Hexray les agrège, les priorise, puis les fait synthétiser par un agent en un résumé exécutif avec recommandations, dans le format d'un vrai livrable d'audit.

## Stack

- TypeScript, Node.js
- Vitest pour les tests (convention Given/When/Then)
- tsup pour le build
- Architecture hexagonale : domaine pur, ports/adapters pour les outils d'analyse externes

## Architecture

```
src/
  domain/          Finding, priorisation par sévérité (aucune dépendance externe)
  application/      cas d'usage RunAudit, ports (StaticAnalyzerPort, ReportGenerator)
  infrastructure/    adapters concrets (ESLint, dependency-cruiser, Detekt, ArchUnit...)
  presentation/       point d'entrée CLI
```

Le domaine ne connaît jamais un outil d'analyse concret : chaque outil tiers est branché derrière `StaticAnalyzerPort`.

## Installation

```bash
npm install
```

## Développement

```bash
npm run test        # tests une fois
npm run test:watch  # tests en mode watch
npm run typecheck
npm run lint
npm run build
```

Pas de serveur de dev ni de port associé : Hexray est un outil CLI, pas une application web.

## Utilisation

```bash
npx hexray ./chemin/vers/un/repo
```

Statut actuel : le squelette architecture/CLI est en place mais aucun adapter n'est encore branché (voir `src/infrastructure/`). C'est la prochaine étape.

## Feuille de route

- [ ] Adapter ESLint / dependency-cruiser (violations de couches, cycles, TypeScript)
- [ ] Adapter Detekt / ArchUnit (Kotlin)
- [ ] Adapter fraîcheur des dépendances (npm audit, Gradle)
- [ ] Générateur de rapport porté par un agent (résumé exécutif, recommandations priorisées)
- [ ] Rapport HTML autonome

## Licence

MIT

---

© 2026 Riadh MNASRI
