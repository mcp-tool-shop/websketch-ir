<p align="center"><img src="logo.png" alt="WebSketch" width="340"></p>

<p align="center"><strong>Grammar-based intermediate representation for capturing web page UI structure as semantic primitives.</strong></p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/websketch-ir/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/websketch-ir/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://www.npmjs.com/package/@mcptoolshop/websketch-ir"><img src="https://img.shields.io/npm/v/@mcptoolshop/websketch-ir.svg" alt="npm version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-18%2B-brightgreen.svg" alt="node 18+"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.3-blue.svg" alt="TypeScript"></a>
</p>

---

## At a Glance

- **Grammar-based** -- Compiles DOM soup into a small, fixed vocabulary of 23 UI primitives (`BUTTON`, `NAV`, `CARD`, `INPUT`, ...)
- **LLM-friendly** -- ASCII wireframe rendering lets language models reason about layouts without vision
- **Typed** -- Full TypeScript types for every node, capture, and option; zero runtime dependencies
- **Diffable** -- Structural diff engine matches nodes by geometry + role + semantics, not DOM identity
- **Fingerprintable** -- Content-addressed hashing produces stable fingerprints for fast equality checks

## Ecosystem

| Package | Role |
|---------|------|
| **websketch-ir** | Core IR grammar and serialization (this repo) |
| [websketch-vscode](https://github.com/mcp-tool-shop-org/websketch-vscode) | VS Code extension -- capture pages from your editor |
| [websketch-cli](https://github.com/mcp-tool-shop-org/websketch-cli) | Command-line tool for rendering, fingerprinting, and diffing |
| [websketch-extension](https://github.com/mcp-tool-shop-org/websketch-extension) | Chrome extension for capturing pages |
| [websketch-mcp](https://github.com/mcp-tool-shop-org/websketch-mcp) | MCP server for LLM agent integration |
| [websketch-demo](https://github.com/mcp-tool-shop-org/websketch-demo) | Interactive demo and visualization |

## Installation

```bash
npm install @mcptoolshop/websketch-ir
```

## Usage

### Parse and validate a capture

```typescript
import {
  parseCapture,
  renderAscii,
  diff,
  fingerprintCapture,
  validateCapture,
  isSupportedSchemaVersion,
  CURRENT_SCHEMA_VERSION,
} from '@mcptoolshop/websketch-ir';

// Parse and validate a capture (throws WebSketchException on error)
const capture = parseCapture(jsonString);

// Render to ASCII wireframe
const ascii = renderAscii(capture);

// Generate a structural fingerprint
const fp = fingerprintCapture(capture);

// Compare two captures
const result = diff(captureA, captureB);

// Check schema version compatibility
isSupportedSchemaVersion("0.1"); // true
```

### Rendering modes

```typescript
import { renderAscii, renderForLLM, renderStructure } from '@mcptoolshop/websketch-ir';

// Full ASCII wireframe (80x24 grid, box-drawing borders)
const wireframe = renderAscii(capture);

// LLM-optimized view (URL + viewport header, legend footer)
const llmView = renderForLLM(capture);

// Minimal structure-only view (no semantics, no text, ASCII borders)
const structure = renderStructure(capture, 60, 16);
```

### Diffing two captures

```typescript
import { diff, formatDiff } from '@mcptoolshop/websketch-ir';

const result = diff(captureA, captureB, {
  matchThreshold: 0.5,   // minimum similarity to consider a match
  moveThreshold: 0.01,   // bbox movement below this is noise
  resizeThreshold: 0.01, // bbox resize below this is noise
});

// Human-readable report
console.log(formatDiff(result));

// result.summary.counts: { added, removed, moved, resized, text_changed, ... }
// result.topChanges: top N changes ranked by visual area
```

### Fingerprinting

```typescript
import { fingerprintCapture, fingerprintLayout } from '@mcptoolshop/websketch-ir';

// Full structural fingerprint (roles + geometry + text + viewport aspect)
const fp = fingerprintCapture(capture);

// Layout-only fingerprint (ignores text content changes)
const layoutFp = fingerprintLayout(capture);

// Quick equality check
if (fingerprintCapture(a) === fingerprintCapture(b)) {
  console.log('Pages are structurally identical');
}
```

### Import sub-paths

```typescript
// Grammar types only (no runtime code)
import type { UINode, UIRole, BBox01, WebSketchCapture } from '@mcptoolshop/websketch-ir/grammar';

// Error types and utilities
import { WebSketchException, formatWebSketchError } from '@mcptoolshop/websketch-ir/errors';
```

## Schema Versioning

WebSketch IR uses semantic versioning for the capture schema:

- **Current version**: `0.1`
- **Forward compat**: unknown fields are ignored (consumers MUST tolerate them)
- **Backward compat**: validators accept any version in `SUPPORTED_SCHEMA_VERSIONS`
- **Version check**: `isSupportedSchemaVersion(v)` returns `true` for supported versions
- **Unsupported version**: validators return `WS_UNSUPPORTED_VERSION`

## Error Codes

| Code | Meaning |
|------|---------|
| `WS_INVALID_JSON` | Input is not valid JSON |
| `WS_INVALID_CAPTURE` | Capture fails schema validation |
| `WS_UNSUPPORTED_VERSION` | Capture version not supported |
| `WS_LIMIT_EXCEEDED` | Node count or depth exceeds limits |
| `WS_INVALID_ARGS` | Missing or invalid arguments |
| `WS_NOT_FOUND` | File not found |
| `WS_IO_ERROR` | Filesystem I/O error |
| `WS_PERMISSION_DENIED` | Insufficient permissions |
| `WS_INTERNAL` | Unexpected internal error |

## Docs

| Document | Description |
|----------|-------------|
| [HANDBOOK.md](HANDBOOK.md) | Deep-dive guide: grammar model, API reference, diffing, fingerprinting, integration patterns |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Code of conduct |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

## License

MIT License -- see [LICENSE](LICENSE) for details.

> Part of [MCP Tool Shop](https://mcptoolshop.com)
