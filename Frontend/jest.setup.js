require('@testing-library/jest-dom');

const axios = require('axios');
jest.mock('axios');

axios.create = jest.fn(() => ({
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  }
}));

process.env.VITE_API_BASE_URL = 'http://localhost:8000';

global.alert = jest.fn();
global.console.error = jest.fn();
global.console.log = jest.fn();
