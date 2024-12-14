import { readTextFileByPath } from "../../helpers";
import { resolve } from "node:path";

const inputPath = resolve(__dirname, "input.txt");

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const lines = input.split("\n");

  const col1Numbers: number[] = [];
  const col2Numbers: number[] = [];

  lines.forEach((line) => {
    const [col1, col2] = line.match(/\d+/g) ?? [];
    col1Numbers.push(Number(col1));
    col2Numbers.push(Number(col2));
  });

  col1Numbers.sort((a, b) => a - b);
  col2Numbers.sort((a, b) => a - b);

  let difference = 0;

  col1Numbers.forEach((num, idx) => {
    difference += Math.abs(col2Numbers[idx] - num);
  });

  console.log({ answer: difference });
};

void run();
