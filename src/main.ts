import * as fs from "fs";
import { Schedules } from "./types";

async function readJsonFile(filePath: string): Promise<Schedules> {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const filePath = "./data.json";

(async () => {
  // read the file
  const jsonData = await readJsonFile(filePath);

  jsonData.map((s) => {
    console.log(s.employeeName);
  });
  // transform the data
})();
