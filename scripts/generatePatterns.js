import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCellsFile(content) {
  if (!content.includes("!Name")) {
    return null;
  }

  const lines = content.split("\n");
  let name = "Unknown";
  const rows = [];

  for (const line of lines) {
    if (line.startsWith("!")) {
      if (line.includes("Name:")) {
        name = line.split("Name:")[1].trim();
      }
      continue;
    }

    if (!line.trim()) {
      continue;
    }

    // Parse grid rows
    const row = line.split("").map((char) => (char === "O" ? 1 : 0));
    rows.push(row);
  }

  // Determine the size of the uniform matrix (maximum row length)
  const maxLength = Math.max(...rows.map((row) => row.length));

  // Pad each row to match the maximum length
  const pattern = rows.map((row) => {
    while (row.length < maxLength) {
      row.push(0);
    } // Add zeros for padding
    return row;
  });

  return { name, pattern };
}

function main() {
  const patternsDir = path.join(__dirname, "patterns");
  const outputPath = path.join(__dirname, "../src/data/patterns.ts");

  if (!fs.existsSync(patternsDir)) {
    console.error(
      "Patterns directory does not exist. Run downloadPatterns.js first."
    );
    return;
  }

  const files = fs.readdirSync(patternsDir);

  const patterns = [];

  for (const file of files) {
    try {
      const filePath = path.join(patternsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const parsed = parseCellsFile(fileContent);

      if (parsed) {
        patterns.push(parsed);
      }
    } catch (error) {
      console.error(`Failed to process ${file}:`, error);
    }
  }

  const tsObject = `export const patterns = ${JSON.stringify(patterns)}`;

  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, tsObject);
  console.log(`Patterns written to ${outputPath}`);
}

main();
