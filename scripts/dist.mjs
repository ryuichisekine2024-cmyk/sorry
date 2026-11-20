// Copies only the files the site needs into dist/ (used by Vercel).
import { cpSync, rmSync, mkdirSync } from "node:fs";

const OUT = "dist";
const FILES = ["index.html", "assets", "images"];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const file of FILES) cpSync(file, `${OUT}/${file}`, { recursive: true });

console.log(`Copied ${FILES.join(", ")} to ${OUT}/`);
