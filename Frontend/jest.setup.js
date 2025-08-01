// frontend/jest.setup.js
require('@testing-library/jest-dom');

// Mock axios and give it a .create() with interceptors
const axios = require('axios');
jest.mock('axios');

// Provide a dummy axios.create() so apiClient.interceptors exists
axios.create = jest.fn(() => ({
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  }
}));

// Set environment variables for tests
process.env.VITE_API_BASE_URL = 'http://localhost:8000';

// Global test setup
global.alert = jest.fn();
global.console.error = jest.fn();
global.console.log = jest.fn();
