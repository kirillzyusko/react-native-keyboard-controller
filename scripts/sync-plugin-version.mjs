import { readFile, writeFile } from "node:fs/promises";

const checkOnly = process.argv.includes("--check");
const packageUrl = new URL("../package.json", import.meta.url);
const pluginUrl = new URL("../.codex-plugin/plugin.json", import.meta.url);

const packageJson = JSON.parse(await readFile(packageUrl, "utf8"));
const pluginJson = JSON.parse(await readFile(pluginUrl, "utf8"));

if (pluginJson.version === packageJson.version) {
  console.log(`Plugin version matches package version ${packageJson.version}.`);
  process.exit(0);
}

if (checkOnly) {
  console.error(
    `Plugin version ${pluginJson.version} does not match package version ${packageJson.version}.`,
  );
  process.exit(1);
}

pluginJson.version = packageJson.version;
await writeFile(pluginUrl, `${JSON.stringify(pluginJson, null, 2)}\n`);
console.log(`Updated plugin version to ${packageJson.version}.`);
