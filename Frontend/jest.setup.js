require('@testing-library/jest-dom');

// Set environment variables for tests
process.env.VITE_API_BASE_URL = 'http://localhost:8000';

// Mock API calls to prevent actual HTTP requests during tests
jest.mock('axios');

// Global test setup
global.alert = jest.fn();
global.console.error = jest.fn();
global.console.log = jest.fn();
