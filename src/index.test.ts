import { add } from "./index.ts";

describe("index", () => {
  test("add", () => {
    expect(add(1, 2)).toBe(3);
  });
});
