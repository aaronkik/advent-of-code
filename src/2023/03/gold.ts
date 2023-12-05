import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";

const inputPath = resolve(__dirname, "input.txt");

const symbolRegex = new RegExp("[^\\w.]", "g");
const digitRegex = new RegExp("\\d+", "g");
const gearRegex = new RegExp("\\*", "g");

const getSymbolLocations = (result: string) => [...result.matchAll(symbolRegex)].map((value) => Number(value.index));

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const resultsSplitByNewLine = input.split("\n");

  let accumulator = 0;

  resultsSplitByNewLine.forEach((result, index) => {
    const numberLocations: Array<{
      value: number;
      startLocation: number;
      endLocation: number;
    }> = [];

    [...result.matchAll(digitRegex)].forEach((value) => {
      const matchingResult = value[0];
      const startLocation = Number(value.index);
      const endLocation = startLocation + (matchingResult.length - 1);

      numberLocations.push({ value: Number(matchingResult), startLocation, endLocation });
    });

    numberLocations.forEach((numberLocation) => {
      const previousLineSymbolLocations = index > 0 ? getSymbolLocations(resultsSplitByNewLine[index - 1]) : [];
      const sameLineSymbolLocations = getSymbolLocations(result);
      const nextLineSymbolLocations =
        index < resultsSplitByNewLine.length - 1 ? getSymbolLocations(resultsSplitByNewLine[index + 1]) : [];

      const { value, startLocation, endLocation } = numberLocation;

      const hasSymbolInPerimeter =
        sameLineSymbolLocations.some((location) => {
          return location === startLocation - 1 || location === endLocation + 1;
        }) ||
        previousLineSymbolLocations.some((location) => {
          return location >= startLocation - 1 && location <= endLocation + 1;
        }) ||
        nextLineSymbolLocations.some((location) => {
          return location >= startLocation - 1 && location <= endLocation + 1;
        });

      if (hasSymbolInPerimeter) {
        accumulator += value;
      }
    });
  });

  console.log({ result: accumulator });
  // { result: 527369 }
};

run();
