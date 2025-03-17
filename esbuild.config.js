import * as esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import fs from "fs";
import path from "path";

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

const directories = getDirectories("./src/lambda/");
let entry = {};
directories.forEach((functionName) => {
  entry[functionName] = `./src/lambda/${functionName}/index.ts`;
});

esbuild
  .build({
    entryPoints: entry,
    outdir: "dist",
    bundle: true,
    minify: false,
    platform: "node",
    target: "node18",
    logLevel: "info",
    keepNames: true,
    plugins: [
      {
        name: "copy-directory-structure",
        setup(build) {
          build.onEnd(() => {
            directories.forEach((functionName) => {
              if (!fs.existsSync(`dist/${functionName}`)) {
                fs.mkdirSync(`dist/${functionName}`, { recursive: true });
              }
              fs.rename(
                `dist/${functionName}.js`,
                `dist/${functionName}/index.js`,
                () => ({})
              );
            });
          });
        },
      },
      nodeExternalsPlugin(),
    ],
  })
  .catch((err) => {
    console.log(err);
  });
