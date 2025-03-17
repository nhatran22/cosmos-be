import fs from "fs/promises";

async function main(): Promise<void> {
  console.log("=== Clean up ===");
  try {
    await fs.unlink(`${LAYER_PATH}/package.json`);
    await fs.unlink(`${LAYER_PATH}/package-lock.json`);
    await fs.rm(`${LAYER_PATH}/node_modules`, {
      recursive: true,
      force: true,
    });
    await fs.rm(`${LAYER_PATH}/nodejs`, {
      recursive: true,
      force: true,
    });
    await fs.unlink(`./deploy/nodejs.zip`);
  } catch (error) {
    console.log(error);
  }
}

const LAYER_PATH = `./scripts`;
(async () => await main())();
