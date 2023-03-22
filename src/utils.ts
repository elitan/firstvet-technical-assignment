import * as fs from "fs";
import { Schedules } from "./types";

export async function readJsonFile(filePath: string): Promise<Schedules> {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function getExternalBreakKeys(index: number) {
  if (index === 0) {
    return {
      externalStartBreakKey: "startBreak",
      externalEndBreakKey: "endBreak",
    };
  }

  return {
    externalStartBreakKey: `startBreak${index + 1}`,
    externalEndBreakKey: `endBreak${index + 1}`,
  };
}
