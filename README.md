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
  infrastructure/    adapters concrets (dependency-cruiser, Claude pour la synthèse, rapport HTML, Detekt/ArchUnit à venir...)
  presentation/       point d'entrée CLI
```

Le domaine ne connaît jamais un outil d'analyse concret : chaque outil tiers est branché derrière `StaticAnalyzerPort`.

## Installation

```bash
npm install
```

## Variables d'environnement

- `ANTHROPIC_API_KEY` (obligatoire pour générer le rapport) : clé de l'API Claude, utilisée pour synthétiser les findings en résumé exécutif.
- `HEXRAY_MODEL` (optionnel) : identifiant de modèle Claude à utiliser, par défaut `claude-opus-4-8`.

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

Écrit un rapport `hexray-report.html` autonome (résumé exécutif et recommandations générés par Claude, puis la liste complète des findings) dans le dossier audité. Si aucun problème n'est détecté, aucun appel à l'API n'est fait.

Statut actuel : détection des violations de couches et des cycles de dépendances pour TypeScript (via dependency-cruiser), synthèse par Claude et rapport HTML. Pas encore de support Kotlin.

## Feuille de route

- [x] Adapter dependency-cruiser (violations de couches, cycles, TypeScript)
- [x] Générateur de rapport porté par un agent (résumé exécutif, recommandations priorisées)
- [x] Rapport HTML autonome
- [ ] Adapter Detekt / ArchUnit (Kotlin)
- [ ] Adapter fraîcheur des dépendances (npm audit, Gradle)

## Licence

MIT

---

© 2026 Riadh MNASRI
