// calculator.test.js
const { add, subtract, multiply, divide } = require("../src/math.js");

describe("Calculator Functions", () => {
  // Addition function tests
  describe("add", () => {
    it("should add two positive numbers correctly", () => {
      expect(add(2, 3)).toBe(5);
    });

    it("should add a positive number and zero correctly", () => {
      expect(add(5, 0)).toBe(5);
    });

    it("should handle adding a negative number", () => {
      expect(add(-4, 7)).toBe(3);
    });

    it("should add zero to zero correctly", () => {
      expect(add(0, 0)).toBe(0);
    });
  });

  // Subtraction function tests
  describe("subtract", () => {
    it("should subtract two positive numbers correctly", () => {
      expect(subtract(10, 4)).toBe(6);
    });

    it("should handle subtracting a negative number", () => {
      expect(subtract(4, -7)).toBe(11);
    });

    it("should subtract zero correctly", () => {
      expect(subtract(8, 0)).toBe(8);
    });
  });

  // Multiplication function tests
  describe("multiply", () => {
    it("should multiply two positive numbers correctly", () => {
      expect(multiply(2, 3)).toBe(6);
    });

    it("should multiply a positive number by zero to return zero", () => {
      expect(multiply(5, 0)).toBe(0);
    });

    it("should handle multiplying a negative number", () => {
      expect(multiply(-4, 7)).toBe(-28);
    });

    it("should multiply by zero to return zero", () => {
      expect(multiply(0, 10)).toBe(0);
    });
  });

  // Division function tests
  describe("divide", () => {
    it("should divide two positive numbers correctly", () => {
      expect(divide(8, 2)).toBe(4);
    });

    it("should handle dividing a negative number", () => {
      expect(divide(-20, 4)).toBe(-5);
    });

    it("should throw an error for division by zero", () => {
      expect(() => divide(10, 0)).toThrow("Division by zero is not allowed.");
    });

    it("should return zero when dividing zero by a number", () => {
      expect(divide(0, 5)).toBe(0);
    });
  });
});
