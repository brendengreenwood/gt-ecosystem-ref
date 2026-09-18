// Base-compatible probe: counts strategies carrying a non-empty `commodities` array.
// Resolves the data file from the working directory so it can run inside a worktree of main.
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const { ACTORS } = await import(pathToFileURL(resolve(process.cwd(), "src/data/actors.js")).href);
const all = ACTORS.flatMap((a) => a.strategies);
const tagged = all.filter((s) => Array.isArray(s.commodities) && s.commodities.length > 0);
console.log(`probe: strategies ${all.length} tagged ${tagged.length}`);
process.exit(all.length > 0 && tagged.length === all.length ? 0 : 1);
