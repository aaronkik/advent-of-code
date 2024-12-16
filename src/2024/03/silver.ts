import { readTextFileByPath } from "../../helpers";
import { resolve } from "node:path";

const inputPath = resolve(__dirname, "input.txt");

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  // match mul(123,456)
  const mulRegex = /mul\(\d{1,3},\d{1,3}\)/gm;
  const mulMatches = input.match(mulRegex);
  console.log(mulMatches);

  const sumOfMuls = mulMatches?.reduce((previous, current) => {
    const multipliedMul =
      current.match(/\d+/g)?.reduce((p, c) => {
        return p * Number(c);
      }, 1) ?? 0;

    return previous + multipliedMul;
  }, 0);

  console.log({ answer: sumOfMuls });
};

void run();
