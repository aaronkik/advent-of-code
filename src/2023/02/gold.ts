import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";

const inputPath = resolve(__dirname, "input.txt");

const splitGameBySet = (game: string) => game.replace(/^Game \d: /, "").split("; ");

const getRedGreenBlueFromSet = (set: string) => {
  const redResult = set.match(/(\d+) red/);
  const greenResult = set.match(/(\d+) green/);
  const blueResult = set.match(/(\d+) blue/);

  return {
    red: redResult ? Number(redResult[1]) : 0,
    green: greenResult ? Number(greenResult[1]) : 0,
    blue: blueResult ? Number(blueResult[1]) : 0,
  } as const;
};

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const resultsSplitByNewLine = input.split("\n");

  const powerOfMinumumPossibleSet = resultsSplitByNewLine.map((game) => {
    const gameSplitBySet = splitGameBySet(game);

    const redGreenBlueFromSet = gameSplitBySet.map((set) => getRedGreenBlueFromSet(set));

    const maxRed = Math.max(...redGreenBlueFromSet.map((set) => set.red));
    const maxGreen = Math.max(...redGreenBlueFromSet.map((set) => set.green));
    const maxBlue = Math.max(...redGreenBlueFromSet.map((set) => set.blue));

    return maxRed * maxGreen * maxBlue;
  });

  const result = powerOfMinumumPossibleSet.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  console.log({ result });
  // { result: 67363 }
};

run();
