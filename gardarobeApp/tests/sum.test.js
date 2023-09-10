const sum = require("../src/sum");
const sum2 = require("../src/sum");
const mulitply = require("../src/sum");

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});

test("adds 2 + 2 to equal 4", () => {
  expect(sum2(2, 2)).toBe(4);
});

//Test multiple functions in one file
test("mulitply 2 * 2 to equal 4", () => {
  expect(mulitply(2, 2)).toEqual(4);
  expect(mulitply(5, 2)).toEqual(7);
});
