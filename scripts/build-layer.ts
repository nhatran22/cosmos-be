import { exec } from "child_process";
import compressing from "compressing";
import fsExtra from "fs-extra";
import fs from "fs/promises";
import util from "util";

async function getPackageJson(): Promise<string> {
  console.log("1. Read origin package json");
  const data = await fs.readFile(`package.json`, "utf-8");
  const json = JSON.parse(data);
  delete json["devDependencies"];
  return json;
}

async function writePackageJson(packageJson: unknown): Promise<void> {
  console.log("2. Write packge json with dependencies only");
  await fs.writeFile(
    `${LAYER_PATH}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );
}

const execPromise = util.promisify(exec);
async function npmInstall(): Promise<void> {
  console.log("3. NPM install");
  await execPromise(`cd ${LAYER_PATH} && npm install`);
}

async function compressNodeModules(): Promise<void> {
  console.log("4. Compress node_modules");
  await fsExtra.copy(
    `${LAYER_PATH}/node_modules`,
    `${LAYER_PATH}/nodejs/node_modules`
  );
  await compressing.zip.compressDir(
    `${LAYER_PATH}/nodejs`,
    `${LAYER_PATH}/nodejs.zip`
  );
}

async function moveCompressToDeployFolder(): Promise<void> {
  console.log("5. Move compress to deploy folder");
  await fsExtra.move(`${LAYER_PATH}/nodejs.zip`, `./deploy/nodejs.zip`, {
    overwrite: true,
  });
}

async function main(): Promise<void> {
  console.log("=== Build Layer ===");
  const packageJson = await getPackageJson();
  await writePackageJson(packageJson);
  await npmInstall();
  await compressNodeModules();
  await moveCompressToDeployFolder();
  console.log("=== Start Deploy ===");
}

const LAYER_PATH = `./scripts`;
(async () => await main())();
