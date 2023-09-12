// tests/api.test.js
const { fetchData } = require("../src/api");
const fetchMock = require("jest-fetch-mock");

// Configure jest-fetch-mock
fetchMock.enableMocks();

describe("API Request", () => {
  it("should fetch data from a URL", async () => {
    // Mock a successful response
    fetchMock.mockResponse(JSON.stringify({ message: "Hello, world!" }));

    const url = "https://example.com/api/data";
    const data = await fetchData(url);

    expect(data.message).toBe("Hello, world!");
  });

  it("should handle a failed network request", async () => {
    // Mock a network error
    fetchMock.mockReject(new Error("Network error"));

    const url = "https://example.com/api/data";

    await expect(fetchData(url)).rejects.toThrow("Network error");
  });

  it("should handle an invalid JSON response", async () => {
    // Mock an invalid JSON response
    fetchMock.mockResponse("Not a JSON response", { status: 200 });

    const url = "https://example.com/api/data";

    await expect(fetchData(url)).rejects.toThrow(/Invalid JSON response/i);
  });

  it("should handle a non-200 HTTP status code", async () => {
    // Mock a non-200 HTTP status code
    fetchMock.mockResponse("", { status: 404 });

    const url = "https://example.com/api/nonexistent";

    await expect(fetchData(url)).rejects.toThrow("Failed to fetch data from");
  });
});
