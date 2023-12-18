import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";

const inputPath = resolve(__dirname, "input.txt");

const digitRegex = new RegExp("\\d+", "g");
const gearRegex = new RegExp("\\*", "g");

const getNumberLocations = (result: string) =>
  [...result.matchAll(digitRegex)].map((value) => {
    const matchingResult = value[0];
    const startLocation = Number(value.index);
    const endLocation = startLocation + (matchingResult.length - 1);
    return { value: Number(matchingResult), startLocation, endLocation };
  });

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const resultsSplitByNewLine = input.split("\n");

  let accumulator = 0;

  resultsSplitByNewLine.forEach((result, index) => {
    const gearLocations: Array<{
      location: number;
    }> = [];

    [...result.matchAll(gearRegex)].forEach((value) => {
      const location = Number(value.index);
      gearLocations.push({ location: Number(location) });
    });

    gearLocations.forEach((gearLocation) => {
      const previousLineNumberLocations = index > 0 ? getNumberLocations(resultsSplitByNewLine[index - 1]) : [];
      const sameLineNumberLocations = getNumberLocations(result);
      const nextLineNumberLocations =
        index < resultsSplitByNewLine.length - 1 ? getNumberLocations(resultsSplitByNewLine[index + 1]) : [];

      const previousLineNumbersNearGear = previousLineNumberLocations.filter(({ startLocation, endLocation }) => {
        return (
          startLocation - gearLocation.location === -1 ||
          startLocation - gearLocation.location === 0 ||
          startLocation - gearLocation.location === 1 ||
          endLocation - gearLocation.location === -1 ||
          endLocation - gearLocation.location === 0 ||
          endLocation - gearLocation.location === 1
        );
      });

      const sameLineNumbersNearGear = sameLineNumberLocations.filter(({ startLocation, endLocation }) => {
        return endLocation - gearLocation.location === -1 || startLocation - gearLocation.location === 1;
      });

      const nextLineNumbersNearGear = nextLineNumberLocations.filter(({ startLocation, endLocation }) => {
        return (
          startLocation - gearLocation.location === -1 ||
          startLocation - gearLocation.location === 0 ||
          startLocation - gearLocation.location === 1 ||
          endLocation - gearLocation.location === -1 ||
          endLocation - gearLocation.location === 0 ||
          endLocation - gearLocation.location === 1
        );
      });

      const numbers = [...previousLineNumbersNearGear, ...sameLineNumbersNearGear, ...nextLineNumbersNearGear];

      if (numbers.length === 2) {
        const multiplied = numbers.reduce((prev, curr) => {
          return prev * curr.value;
        }, 1);

        accumulator += multiplied;
      }
    });
  });

  console.log({ result: accumulator });
  // { result: 73074886 }
};

run();
