import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";

const inputPath = resolve(__dirname, "input.txt");

const numberMapper = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
} as const;

const run = async () => {
  const input = await readTextFileByPath(inputPath);
  const wordsSplitByNewLine = input.split("\n");

  const converInputToStringifiedNumbers = wordsSplitByNewLine.map((word) => {
    const matchResultStore: Array<{ value: string; idx: number }> = [];

    for (const [key, value] of Object.entries(numberMapper)) {
      const matches = word.matchAll(new RegExp(`(${key}|${value})`, "g"));
      const matchResults = [...matches];

      if (matchResults.length) {
        matchResults.forEach((result) => {
          matchResultStore.push({ value, idx: Number(result.index) });
        });
      }
    }

    const sortMatchResultStore = matchResultStore.sort((a, b) => a.idx - b.idx);
    const joinedNumbers = sortMatchResultStore.map(({ value }) => value).join("");
    return joinedNumbers;
  });

  const firstAndLastNumbersFromString = converInputToStringifiedNumbers.map((string) => {
    return Number(`${string.at(0)}${string.at(-1)}`);
  });

  const result = firstAndLastNumbersFromString.reduce((pv, cv) => pv + cv, 0);
  console.log({ result });
  // { result: 54087 }
};

run();
