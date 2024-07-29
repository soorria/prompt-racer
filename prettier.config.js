/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],

  semi: false,
  arrowParens: "always",
  singleQuote: false,
  printWidth: 100,
  trailingComma: "all",

  tailwindFunctions: ["cn", "cva"],
};

export default config;
