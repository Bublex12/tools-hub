import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "icons");
const TERTIARY = "#FF5A1F";

const mapping = {
  "lucide:layout-grid": "turnaround-splitter.svg",
  "lucide:list": "sql-in-generator.svg",
  "simple-icons:postgresql": "pg-explain-parser.svg",
  "lucide:braces": "json-decoder.svg",
  "lucide:wrench": "hub.svg",
};

const icons = JSON.parse(process.argv[2]);

fs.mkdirSync(iconsDir, { recursive: true });

for (const item of icons) {
  const filename = mapping[item.fullName];
  if (!filename) continue;
  const svg = item.icon.replace(/currentColor/g, TERTIARY);
  fs.writeFileSync(path.join(iconsDir, filename), svg, "utf8");
  console.log("wrote", filename);
}
