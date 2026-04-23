import fs from "fs/promises";
import path from "path";

export async function writeLog(data) {
  const date = new Date().toISOString().split("T")[0];
  const filePath = path.join("logs", `${date}.json`);

  const jsonString = JSON.stringify(data, null, 2);

  await fs.writeFile(filePath, jsonString);

  return filePath;
}
