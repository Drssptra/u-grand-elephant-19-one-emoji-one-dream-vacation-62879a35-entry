// One Emoji, One Dream Vacation — u-grand-elephant-19-one-emoji-one-dream-vacation-62879a35
//
// The entry is a single emoji: 🌅 (U+1F305, sunrise over the sea).
// A dawn breaking over open water — the first morning of a trip far from home,
// the postcard moment every dream vacation starts with. One code point,
// four bytes of UTF-8, readable at any size on any screen.
//
// Writes the emoji, with no trailing newline, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt), and prints
// exactly the same emoji plus a trailing newline to stdout.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EMOJI = "🌅";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), EMOJI, "utf8");
process.stdout.write(EMOJI + "\n");
