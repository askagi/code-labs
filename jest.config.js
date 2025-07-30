const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});
const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000, // ajusta o tempo de espera de saida, ou seja, tempo maximo q o jest pode aguardar antes de rodar o teste (BeforeAll())
});
module.exports = jestConfig;
