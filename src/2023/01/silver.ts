import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";

const inputPath = resolve(__dirname, "input.txt");

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const wordsSplitByNewLine = input.split("\n");

  const filterNumbersInStrings = wordsSplitByNewLine.map((string) => {
    return [...string].filter((str) => !isNaN(Number(str))).join("");
  });

  const firstAndLastNumbersFromString = filterNumbersInStrings.map((string) => {
    return Number(`${string.at(0)}${string.at(-1)}`);
  });

  const result = firstAndLastNumbersFromString.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  console.log({ result });
  // { result: 54708 }
};

run();
