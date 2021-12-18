module.exports = {
  roots: ['<rootDir>/test'],
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx|js)?$": "ts-jest",
  },
  testRegex: "/src/.*\\.test.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: ["node","jest-environment-jsdom"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$": "identity-obj-proxy",
  },
  setupFiles: [
    "./src/tests/setup-tests.ts",
    "jsdom-worker"
  ]
};
