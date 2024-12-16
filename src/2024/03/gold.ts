import { readTextFileByPath } from "../../helpers";
import { resolve } from "node:path";

const inputPath = resolve(__dirname, "input.txt");

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const mulRegex = /do\(\)|don't\(\)|mul\(\d{1,3},\d{1,3}\)/gm;
  const mulMatches = input.match(mulRegex);
  console.log(mulMatches);

  let shouldMultiply = true;

  const sumOfMuls = mulMatches?.reduce((previous, current) => {
    if (current === "don't()") shouldMultiply = false;
    if (current === "do()") shouldMultiply = true;

    if (!shouldMultiply) return previous;

    console.log(current);
    const multipliedMul =
      current.match(/\d+/g)?.reduce((p, c) => {
        return p * Number(c);
      }, 1) ?? 0;

    return previous + multipliedMul;
  }, 0);

  console.log({ answer: sumOfMuls });
};

void run();
