# Changelog

## 1.0.0 — 2026-02-27

### Changed
- Promoted to v1.0.0 — production-ready release
- Added SECURITY.md, SHIP_GATE.md, SCORECARD.md
- Added Security & Data Scope and Scorecard to README

## 0.4.0 — 2026-02-18

### Added
- HANDBOOK.md — deep-dive guide covering grammar model, API reference, diffing, fingerprinting, error handling, and integration

### Changed
- README.md — rewritten with "At a Glance" section, ecosystem table, docs table, standardized badge row

## 0.3.1

- **feat**: Schema version compatibility helpers (`isSupportedSchemaVersion`, `CURRENT_SCHEMA_VERSION`, `SUPPORTED_SCHEMA_VERSIONS`)
- **feat**: Version validation in `validateCapture()` now uses `compat.ts` (extensible for future versions)
- **docs**: Getting Started workflow, schema versioning rules, error code reference
- **docs**: CHANGELOG.md

## 0.3.0

- **feat**: Error taxonomy (`WebSketchException`, `WebSketchError`, canonical error codes)
- **feat**: `validateCapture()` with resource limits (`maxNodes`, `maxDepth`, `maxStringLength`)
- **feat**: `parseCapture()` for strict parse + validate with typed exceptions
- **feat**: `formatWebSketchError()` for human-readable error output

## 0.2.0

- **feat**: ASCII rendering (`renderAscii`, `renderForLLM`, `renderStructure`)
- **feat**: Structural diff (`diff`, `formatDiff`, `formatDiffJson`)
- **feat**: Fingerprinting (`fingerprintCapture`, `fingerprintLayout`)
- **feat**: Text processing (`normalizeText`, `createTextSignal`, `hashSync`)
- **feat**: Node hashing and similarity scoring

## 0.1.0

- Initial release
- Grammar types (`UINode`, `UIRole`, `BBox01`, `WebSketchCapture`)
- Constants (`MAX_DEPTH`, `MAX_CHILDREN`, `BBOX_QUANT_STEP`)
