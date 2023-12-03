import { readFile } from "node:fs";

export const readTextFileByPath = (path: string) => {
  return new Promise<string>((resolve, reject) => {
    readFile(path, (err, data) => {
      if (err) reject(err);
      const txt = data.toString("utf-8");
      resolve(txt);
    });
  });
};
