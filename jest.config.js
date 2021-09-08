module.exports = {
    roots: ['<rootDir>/test'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    testEnvironment: 'jest-environment-jsdom',
  }