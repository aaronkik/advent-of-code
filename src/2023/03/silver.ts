import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";

const inputPath = resolve(__dirname, "input.txt");

const symbolRegex = new RegExp("[^\\w.]", "g");
const digitRegex = new RegExp("\\d+", "g");

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const resultsSplitByNewLine = input.split("\n");

  const accumulator = 0;

  [resultsSplitByNewLine[1]].forEach((result, index) => {
    const numberLocations: Array<{
      result: string;
      startLocation: number;
      endLocation: number;
    }> = [];

    [...result.matchAll(digitRegex)].forEach((value) => {
      const matchingResult = value[0];
      const startLocation = Number(value.index);
      const endLocation = startLocation + (matchingResult.length - 1);

      numberLocations.push({ result: matchingResult, startLocation, endLocation });
    });

    console.log({
      result,
      numberLocations,
    });
    // console.log("DIGIT", [...result.matchAll(digitRegex)]);
    // console.log([...result.matchAll(symbolRegex)]);
  });

  // console.log({ result });
  // { result: 2528 }
};

run();
