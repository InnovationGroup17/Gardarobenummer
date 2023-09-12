// src/api.js

// Function to make a GET request using the fetch API
async function fetchData(url) {
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}.`);
    }
  
    return response.json();
  }
  
  module.exports = { fetchData };
  