import { describe, it, expect } from "vitest";
import {
  renderAscii,
  renderForLLM,
  renderStructure,
  generateLegend,
} from "../src/index.js";
import { makeCapture, makeNode, makeText } from "./fixtures/index.js";
import {
  minimal,
  loginPage,
  deepNesting,
  repeatedSiblings,
  oddBounds,
  textNode,
} from "./fixtures/captures.js";

// =============================================================================
// Stable width / height
// =============================================================================

describe("renderAscii grid dimensions", () => {
  it("default 80x24 grid", () => {
    const output = renderAscii(minimal);
    const lines = output.split("\n");
    expect(lines).toHaveLength(24);
    for (const line of lines) {
      expect(line).toHaveLength(80);
    }
  });

  it("custom 40x12 grid", () => {
    const output = renderAscii(minimal, { width: 40, height: 12 });
    const lines = output.split("\n");
    expect(lines).toHaveLength(12);
    for (const line of lines) {
      expect(line).toHaveLength(40);
    }
  });

  it("custom 120x40 grid", () => {
    const output = renderAscii(minimal, { width: 120, height: 40 });
    const lines = output.split("\n");
    expect(lines).toHaveLength(40);
    for (const line of lines) {
      expect(line).toHaveLength(120);
    }
  });
});

// =============================================================================
// Deterministic output
// =============================================================================

describe("renderAscii determinism", () => {
  it("renderAscii produces identical output on repeated calls", () => {
    const a = renderAscii(loginPage);
    const b = renderAscii(loginPage);
    expect(a).toBe(b);
  });

  it("renderForLLM produces identical output on repeated calls", () => {
    const a = renderForLLM(loginPage);
    const b = renderForLLM(loginPage);
    expect(a).toBe(b);
  });

  it("renderStructure produces identical output on repeated calls", () => {
    const a = renderStructure(loginPage);
    const b = renderStructure(loginPage);
    expect(a).toBe(b);
  });
});

// =============================================================================
// Text length indicators
// =============================================================================

describe("text length indicators", () => {
  it("short text (< 10 chars) shows . indicator", () => {
    const capture = makeCapture(
      makeNode("PAGE", [0, 0, 1, 1] as const, {
        children: [
          makeNode("BUTTON", [0.1, 0.1, 0.5, 0.2] as const, {
            interactive: true,
            text: makeText("short", { hash: "x", len: 5 }),
          }),
        ],
      })
    );
    const output = renderAscii(capture);
    expect(output).toContain("BTN.");
  });

  it("medium text (< 50 chars) shows .. indicator", () => {
    const capture = makeCapture(
      makeNode("PAGE", [0, 0, 1, 1] as const, {
        children: [
          makeNode("BUTTON", [0.1, 0.1, 0.5, 0.2] as const, {
            interactive: true,
            text: makeText("sentence", { hash: "x", len: 30 }),
          }),
        ],
      })
    );
    const output = renderAscii(capture);
    expect(output).toContain("BTN..");
  });

  it("long text (< 200 chars) shows ... indicator", () => {
    const capture = makeCapture(
      makeNode("PAGE", [0, 0, 1, 1] as const, {
        children: [
          makeNode("BUTTON", [0.1, 0.1, 0.5, 0.2] as const, {
            interactive: true,
            text: makeText("paragraph", { hash: "x", len: 150 }),
          }),
        ],
      })
    );
    const output = renderAscii(capture);
    expect(output).toContain("BTN...");
  });

  it("node with no text shows just role label", () => {
    const capture = makeCapture(
      makeNode("PAGE", [0, 0, 1, 1] as const, {
        children: [
          makeNode("BUTTON", [0.1, 0.1, 0.5, 0.2] as const, {
            interactive: true,
          }),
        ],
      })
    );
    const output = renderAscii(capture);
    expect(output).toContain("[BTN]");
  });
});

// =============================================================================
// renderStructure uses ASCII borders
// =============================================================================

describe("renderStructure border style", () => {
  it("uses ascii borders (+ - |) not box drawing chars", () => {
    const output = renderStructure(loginPage);
    // Should have ASCII border chars
    expect(output).toContain("+");
    expect(output).toContain("-");
    expect(output).toContain("|");
    // Should NOT have box drawing chars
    expect(output).not.toContain("┌");
    expect(output).not.toContain("─");
    expect(output).not.toContain("│");
  });

  it("does not show semantics", () => {
    const output = renderStructure(loginPage);
    // loginPage has semantic "login" on the form — structure mode hides it
    expect(output).not.toContain(":login");
  });
});

// =============================================================================
// renderForLLM format
// =============================================================================

describe("renderForLLM format", () => {
  it("starts with URL: line", () => {
    const output = renderForLLM(loginPage);
    expect(output.split("\n")[0]).toMatch(/^URL: /);
  });

  it("contains Viewport: line", () => {
    const output = renderForLLM(loginPage);
    expect(output).toContain("Viewport: 1920x1080");
  });

  it("contains Captured: line with ISO timestamp", () => {
    const output = renderForLLM(loginPage);
    expect(output).toMatch(/Captured: \d{4}-\d{2}-\d{2}T/);
  });

  it("contains legend at bottom", () => {
    const output = renderForLLM(loginPage);
    const legend = generateLegend();
    expect(output).toContain(legend);
  });
});

// =============================================================================
// Pathological fixtures
// =============================================================================

describe("pathological fixtures render without error", () => {
  it("deepNesting renders valid grid", () => {
    const output = renderAscii(deepNesting);
    const lines = output.split("\n");
    expect(lines).toHaveLength(24);
    for (const line of lines) {
      expect(line).toHaveLength(80);
    }
  });

  it("repeatedSiblings renders valid grid", () => {
    const output = renderAscii(repeatedSiblings);
    const lines = output.split("\n");
    expect(lines).toHaveLength(24);
    for (const line of lines) {
      expect(line).toHaveLength(80);
    }
  });

  it("oddBounds renders valid grid", () => {
    const output = renderAscii(oddBounds);
    const lines = output.split("\n");
    expect(lines).toHaveLength(24);
    for (const line of lines) {
      expect(line).toHaveLength(80);
    }
  });

  it("textNode renders valid grid", () => {
    const output = renderAscii(textNode);
    const lines = output.split("\n");
    expect(lines).toHaveLength(24);
    for (const line of lines) {
      expect(line).toHaveLength(80);
    }
  });
});

// =============================================================================
// Golden snapshots
// =============================================================================

describe("golden render snapshots", () => {
  it("renderAscii(loginPage) matches snapshot", () => {
    expect(renderAscii(loginPage)).toMatchSnapshot();
  });

  it("renderForLLM(loginPage) matches snapshot", () => {
    expect(renderForLLM(loginPage)).toMatchSnapshot();
  });

  it("renderStructure(loginPage) matches snapshot", () => {
    expect(renderStructure(loginPage)).toMatchSnapshot();
  });
});
