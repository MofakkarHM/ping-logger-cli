import fs from "fs/promises";
import { pingDevice } from "./fetcher.js";
import { writeLog, flagConsecutiveFailure } from "./writer.js";

async function main() {
  try {
    const args = process.argv.slice(2);
    let inputFile = "devices.json";
    let outDir = "logs";

    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--input" && args[i + 1]) {
        inputFile = args[i + 1];
      }
      if (args[i] === "--out" && args[i + 1]) {
        outDir = args[i + 1];
      }
    }

    const fileContent = await fs.readFile(inputFile, "utf-8");
    const urls = JSON.parse(fileContent);

    console.log(
      `Starting Ping Logger... (Input: ${inputFile} | out: ${outDir})\n`,
    );

    const rawResult = await Promise.all(urls.map((url) => pingDevice(url)));

    const finalResult = await flagConsecutiveFailure(rawResult, outDir);

    const logPath = await writeLog(finalResult, outDir);

    console.log(`Wrote ${finalResult.length} records to ${logPath}`);
    console.table(finalResult);
  } catch (err) {
    console.log("CLI ERROR: ", err.message);
    process.exit(1);
  }
}

main();
