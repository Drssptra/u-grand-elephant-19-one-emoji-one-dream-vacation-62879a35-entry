// u-grand-elephant-19-one-emoji-one-dream-vacation-62879a35
// One Emoji, One Dream Vacation — v2 resubmission.
//
// The whole entry is a single pictograph: the desert island, built here
// from its Unicode scalar value instead of pasted as a literal, so the
// source never depends on an editor rendering the glyph correctly.
// U+1F3DD sits above the BMP, which means JavaScript stores it as a
// surrogate pair (two UTF-16 code units) even though it is one symbol.
// Everything below is written around that fact: lengths are counted in
// code points, sizes in UTF-8 bytes, never in .length.
//
// Why this island, and not v1's sunrise? A sunrise says "morning".
// An island says "I am not coming back to the office". Palm, sand,
// open water — the entire dream vacation in one character.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Entry definition
// ---------------------------------------------------------------------------

// Desert island, U+1F3DD. Constructed from the scalar value on purpose:
// String.fromCodePoint(0x1f3dd) === "\u{1f3dd}" === "🏝".
const ISLAND_CODE_POINT = 0x1f3dd;
const ENTRY = String.fromCodePoint(ISLAND_CODE_POINT);

// Gate from the brief: the entry must be 1–8 characters. Ours is the
// smallest legal answer — exactly one.
const GATE = { minChars: 1, maxChars: 8, expectedUtf8Bytes: 4 };

// ---------------------------------------------------------------------------
// Validation — every check in code points / bytes, never UTF-16 units
// ---------------------------------------------------------------------------

type Check = { name: string; ok: boolean; detail: string };

function runChecks(text: string): Check[] {
  const points = Array.from(text); // splits on code points, not surrogates
  const bytes = Buffer.byteLength(text, "utf8");
  return [
    {
      name: "single-code-point",
      ok: points.length === 1,
      detail: `${points.length} code point(s)`,
    },
    {
      name: "gate-length",
      ok: points.length >= GATE.minChars && points.length <= GATE.maxChars,
      detail: `${points.length} char(s), gate ${GATE.minChars}-${GATE.maxChars}`,
    },
    {
      name: "utf8-size",
      ok: bytes === GATE.expectedUtf8Bytes,
      detail: `${bytes} byte(s) UTF-8`,
    },
    {
      // U+1F3DD is above the BMP, so JS stores it as a surrogate pair:
      // exactly 2 UTF-16 code units, high 0xD83C + low 0xDFDD. If the
      // pair ever broke apart, .length would be 1 or 3 — catch that here.
      name: "surrogate-pair-intact",
      ok:
        text.length === 2 &&
        text.charCodeAt(0) === 0xd83c &&
        text.charCodeAt(1) === 0xdfdd,
      detail: `UTF-16 units: ${text.length}`,
    },
    {
      name: "is-desert-island",
      ok: text.codePointAt(0) === ISLAND_CODE_POINT,
      detail: `U+${(text.codePointAt(0) ?? 0).toString(16).toUpperCase()}`,
    },
    {
      name: "no-whitespace",
      ok: text === text.trim() && text.length > 0,
      detail: "no leading/trailing whitespace",
    },
  ];
}

const failures = runChecks(ENTRY).filter((c) => !c.ok);
if (failures.length > 0) {
  for (const f of failures) console.error(`check failed: ${f.name} (${f.detail})`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Output — entry.txt, byte-exact, no trailing newline
// ---------------------------------------------------------------------------

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = resolve(outDir, "entry.txt");
writeFileSync(outPath, Buffer.from(ENTRY, "utf8"));

// Read-back: the file must be byte-identical to the entry, and must not
// end with a newline (or anything else) that the brief did not ask for.
const written = readFileSync(outPath); // raw bytes, no decoding assumptions
if (!written.equals(Buffer.from(ENTRY, "utf8"))) {
  console.error("entry.txt is not byte-exact");
  process.exit(1);
}

process.stdout.write(`${ENTRY}\n`);
