import { resolve } from "node:path";
import { readTextFileByPath } from "../../helpers";

const inputPath = resolve(__dirname, "input.txt");

const elfBag = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

const getGameNumber = (game: string) => Number(game.match(/^Game (\d+):/)?.[1]);

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

const isPossibleGame = (sets: Array<ReturnType<typeof getRedGreenBlueFromSet>>) => {
  return !sets.some((set) => set.red > elfBag.red || set.green > elfBag.green || set.blue > elfBag.blue);
};

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const resultsSplitByNewLine = input.split("\n");

  const possibleGames = resultsSplitByNewLine.filter((game) => {
    const gameSplitBySet = splitGameBySet(game);

    const redGreenBlueFromSet = gameSplitBySet.map((set) => getRedGreenBlueFromSet(set));

    return isPossibleGame(redGreenBlueFromSet);
  });

  const getGameNumbersFromPossibleGames = possibleGames.map((game) => getGameNumber(game));

  const result = getGameNumbersFromPossibleGames.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0,
  );
  console.log({ result });
  // { result: 2528 }
};

run();
