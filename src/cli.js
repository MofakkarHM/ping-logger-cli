import fs from "fs/promises";
import { pingDevice } from "./fetcher.js";
import { writeLog } from "./writer.js";

async function main() {
  try {
    const fileContent = await fs.readFile("devices.json", "utf-8");
    const urls = JSON.parse(fileContent);

    console.log(`Starting Ping Logger for ${urls.length} devices `);

    const res = await Promise.all(urls.map((url) => pingDevice(url)));

    const logPath = await writeLog(res);

    console.log(`Wrote ${res.length} records to ${logPath}`);
    console.table(res);
  } catch (err) {
    console.log("CLI ERROR: ", err.message);
    process.exit(1);
  }
}

main();
