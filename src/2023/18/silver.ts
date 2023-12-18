import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";
import { writeFile } from "node:fs";

const inputPath = resolve(__dirname, "input.txt");

const DIG_SYMBOL = "#";

type DigPlanDirection = "U" | "R" | "D" | "L";

const digPlanRegex = new RegExp("(?<direction>^\\w{1})(?<area> \\d+ )", "g");

const run = async () => {
  const input = await readTextFileByPath(inputPath);
  const digPlan = input.split("\n");

  const mappedPlan = digPlan.map((plan) => {
    const regexResult = [...plan.matchAll(digPlanRegex)];

    const regexResultGroup = regexResult[0].groups;

    if (!regexResultGroup || !("direction" in regexResultGroup) || !("area" in regexResultGroup)) {
      throw new Error("REGEX MATCH ERROR");
    }

    return {
      direction: regexResultGroup.direction as DigPlanDirection,
      area: Number(regexResultGroup.area.trim()),
    };
  });

  const digPlanCanvas: Array<string> = Array(1000).fill(".".repeat(1000));

  const position = {
    x: 499,
    y: 499,
  };

  mappedPlan.forEach(({ area, direction }) => {
    for (let i = 0; i < area; i++) {
      position.x = direction === "L" ? position.x - 1 : direction === "R" ? position.x + 1 : position.x;
      position.y = direction === "U" ? position.y - 1 : direction === "D" ? position.y + 1 : position.y;

      const xStr = digPlanCanvas[position.y].split("");
      xStr[position.x] = DIG_SYMBOL;
      digPlanCanvas[position.y] = xStr.join("");
    }
  });

  writeFile(`${__dirname}/output-silver.txt`, digPlanCanvas.join("\n"), { encoding: "utf8" }, (err) => {
    if (err) throw err;
  });
};

run();
