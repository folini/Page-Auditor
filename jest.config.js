module.exports = {
    roots: ['<rootDir>/test'],
    transform: {
      '^.+\\.(ts|js)$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: [
      "jsdom-worker"
    ]
  }