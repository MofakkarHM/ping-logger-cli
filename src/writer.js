// src/writer.js
import fs from "fs/promises";
import path from "path";

export async function flagConsecutiveFailure(currentResults, logDir) {
  try {
    const files = await fs.readdir(logDir);

    const logFiles = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse();

    if (logFiles.length < 2) {
      return currentResults;
    }

    const log1 = JSON.parse(
      await fs.readFile(path.join(logDir, logFiles[0]), "utf-8"),
    );

    const log2 = JSON.parse(
      await fs.readFile(path.join(logDir, logFiles[1]), "utf-8"),
    );

    return currentResults.map((current) => {
      if (current.statusCode === "DOWN" || current.statusCode === "TIMEOUT") {
        const match1 = log1.find((l) => l.host === current.host);
        const match2 = log2.find((l) => l.host === current.host);

        const down1 =
          match1 &&
          (match1.statusCode === "DOWN" || match1.statusCode === "TIMEOUT");
        const down2 =
          match2 &&
          (match2.statusCode === "DOWN" || match2.statusCode === "TIMEOUT");

        if (down1 && down2) {
          current.alert = "Down 3 runs in a row";
        }
      }
      return current;
    });
  } catch (error) {
    console.log("History Check Failed: ", error.message);
    return currentResults;
  }
}

export async function writeLog(data, logDir) {
  await fs.mkdir(logDir, { recursive: true });

  const date = new Date().toISOString().split("T")[0];
  const filePath = path.join(logDir, `${date}.json`);

  const jsonString = JSON.stringify(data, null, 2);

  await fs.writeFile(filePath, jsonString);

  return filePath;
}
