    // frontend/jest.config.cjs
    module.exports = {
      testEnvironment: 'jest-environment-jsdom',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      moduleNameMapper: {
        '\\.(css|less)$': '<rootDir>/__mocks__/styleMock.cjs',
      },
    };
    
  