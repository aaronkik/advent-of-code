import { readTextFileByPath } from "../../helpers";
import { resolve } from "node:path";

const inputPath = resolve(__dirname, "input.txt");

const run = async () => {
  const input = await readTextFileByPath(inputPath);
  const reports = input.split("\n");

  let safeLevels = 0;

  reports.forEach((line) => {
    const unformattedLevels = line.match(/\d+/g) ?? [];
    const levels = unformattedLevels.map(Number);

    let isLevelSafe = true;
    let direction: "ASC" | "DESC" | "NONE";

    levels.forEach((level, idx) => {
      if (idx === 0 || !isLevelSafe) return;

      const prevLevel = levels[idx - 1];

      if (idx === 1 && level > prevLevel) direction = "ASC";
      if (idx === 1 && level < prevLevel) direction = "DESC";
      if (level === prevLevel) direction = "NONE";

      if (direction === "NONE") {
        isLevelSafe = false;
        return;
      }

      const difference = direction === "ASC" ? level - prevLevel : prevLevel - level;

      if (!(difference >= 1 && difference <= 3)) {
        isLevelSafe = false;
        return;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isLevelSafe) safeLevels++;
  });

  console.log({ answer: safeLevels });
};

void run();
