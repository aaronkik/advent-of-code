import { readTextFileByPath } from "../../helpers";
import { resolve } from "node:path";

const inputPath = resolve(__dirname, "input.txt");

const run = async () => {
  const input = await readTextFileByPath(inputPath);

  const lines = input.split("\n");

  const col1Numbers: number[] = [];
  const col2NumberOccurrences = new Map<number, number>();

  lines.forEach((line) => {
    const [col1, col2] = line.match(/\d+/g) ?? [];

    col1Numbers.push(Number(col1));

    const col2Number = Number(col2);
    const col2NumberOccurrence = col2NumberOccurrences.get(col2Number);
    col2NumberOccurrences.set(col2Number, col2NumberOccurrence ? col2NumberOccurrence + 1 : 1);
  });

  let similarity = 0;

  col1Numbers.forEach((num) => {
    similarity += num * (col2NumberOccurrences.get(num) ?? 0);
  });

  console.log({ answer: similarity });
};

void run();
