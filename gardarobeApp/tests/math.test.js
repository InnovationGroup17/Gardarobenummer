// tests/math.test.js
const { sum, multiply } = require("../src/math");

describe("Math Functions", () => {
  // Test cases for the sum function
  describe("sum", () => {
    it("should add two positive numbers correctly", () => {
      expect(sum(2, 3)).toBe(5);
    });

    it("should add a positive number and zero correctly", () => {
      expect(sum(5, 0)).toBe(5);
    });

    it("should handle negative numbers correctly", () => {
      expect(sum(-4, 7)).toBe(3);
    });

    it("should return zero when adding zero to zero", () => {
      expect(sum(0, 0)).toBe(0);
    });
  });

  // Test cases for the multiply function
  describe("multiply", () => {
    it("should multiply two positive numbers correctly", () => {
      expect(multiply(2, 3)).toBe(6);
      expect(multiply(5, 10)).toBe(50);
      expect(multiply(1, 1)).toBe(1);
    });

    it("should multiply a positive number by zero to return zero", () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it("should handle negative numbers correctly", () => {
      expect(multiply(-4, -7)).toBe(28);
    });

    it("should handle negative and positive numbers correctly", () => {
      expect(multiply(-4, 7)).toBe(-28);
    });

    it("should return zero when one of the numbers is zero", () => {
      expect(multiply(0, 10)).toBe(0);
    });

    it("should return zero when both numbers are zero", () => {
      expect(multiply(0, 0)).toBe(0);
    });

    it("should handle floating-point numbers", () => {
      expect(multiply(2.5, 4)).toBe(10);
    });

    it("should handle negative floating-point numbers", () => {
      expect(multiply(-2.5, 4)).toBe(-10);
    });

    it("should handle floating-point numbers that are less than one", () => {
      expect(multiply(1 / 2, 4)).toBe(2);
      expect(multiply(1 / 2, 1 / 4)).toBe(1 / 8);
      expect(multiply(0.1, 0.2)).toBeCloseTo(0.02);
      expect(multiply(0.5, 4)).toBe(2);
    });

    it("should handle large numbers", () => {
      expect(multiply(1000000, 1000000)).toBe(1000000000000);
      expect(multiply(10000000, 10000000)).toBe(100000000000000);
      expect(multiply(9999999, 9999999)).toBe(99999980000001);
      expect(multiply(99999999, 99999999)).toBe(9999999800000001);
    });
  });
});
