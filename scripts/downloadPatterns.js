import axios from "axios";
import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://conwaylife.com/patterns/";

async function fetchPatternFiles() {
  console.log("Fetching pattern files...");

  const response = await axios.get(BASE_URL);
  const $ = cheerio.load(response.data);

  // Extract all .cells file links
  const links = [];

  $("a[href$='.cells']").each((_i, elem) => {
    const href = $(elem).attr("href");
    if (href) {
      links.push(BASE_URL + href.split("/").pop());
    }
  });

  console.log(`Found ${links.length} patterns.`);

  return links;
}

async function downloadFile(url, saveDir) {
  const filename = path.basename(url);
  const filePath = path.join(saveDir, filename);

  const response = await axios.get(url, { responseType: "stream" });
  const writer = fs.createWriteStream(filePath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}

async function main() {
  const saveDir = path.join(__dirname, "patterns");

  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir);
  }

  const files = await fetchPatternFiles();

  for (const fileUrl of files) {
    try {
      console.log(`Downloading ${fileUrl}...`);
      const filePath = await downloadFile(fileUrl, saveDir);
    } catch (err) {
      console.error(`Failed to download ${fileUrl}`, error);
    }
  }

  console.log(`All patterns downloaded to ${saveDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
