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

Hexray n'est pas encore publié sur npm : pour l'instant, on le construit et on l'exécute en local (voir la feuille de route).

### 1. Cloner et construire

```bash
git clone https://github.com/riadh-mnasri/hexray.git
cd hexray
npm install
npm run build
```

### 2. Configurer la clé API

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

Optionnel, pour changer de modèle :

```bash
export HEXRAY_MODEL=claude-sonnet-5
```

### 3. Lancer l'audit

L'argument est le chemin vers la racine du projet à auditer (celui qui contient son dossier `src/`) :

```bash
node dist/cli.js /chemin/vers/le/projet/a/auditer
```

Pour l'utiliser comme une commande le temps du développement :

```bash
npm link
hexray /chemin/vers/le/projet/a/auditer
```

### 4. Lire le résultat

- Aucune violation détectée : `hexray: no findings.` s'affiche, et aucun appel à l'API Claude n'est fait (donc aucun coût).
- Violations détectées : un fichier `hexray-report.html` est écrit à la racine du projet audité (résumé exécutif, recommandations priorisées, puis le détail de chaque finding). Ouvrez-le dans un navigateur.

### Exemple, sur le fixture de test livré avec le repo

```bash
node dist/cli.js test/fixtures/layering-violation
# hexray: wrote report to test/fixtures/layering-violation/hexray-report.html
```

Statut actuel : détection des violations de couches et des cycles de dépendances pour TypeScript (via dependency-cruiser), synthèse par Claude et rapport HTML. Pas encore de support Kotlin.

## Feuille de route

- [x] Adapter dependency-cruiser (violations de couches, cycles, TypeScript)
- [x] Générateur de rapport porté par un agent (résumé exécutif, recommandations priorisées)
- [x] Rapport HTML autonome
- [ ] Adapter Detekt / ArchUnit (Kotlin)
- [ ] Adapter fraîcheur des dépendances (npm audit, Gradle)
- [ ] Publier sur npm (pour permettre `npx hexray`)

## Licence

MIT

---

© 2026 Riadh MNASRI
