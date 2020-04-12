import { removeSync } from "fs-extra";
import globby from "globby";
import { resolve, dirname, relative } from "path";
import { ROOT_LOCATION } from "./const";

const folders = new Set<string>();

globby
  .sync(["*.js", "**/*.js", "!node_modules/**/*"], {
    cwd: ROOT_LOCATION,
  })
  .forEach((found) => {
    const absPath = resolve(ROOT_LOCATION, found);
    dirname(absPath) !== ROOT_LOCATION && folders.add(dirname(absPath));
    console.log(`Removing ./${found}...`);
    removeSync(absPath);
  });

[...folders]
  .sort((a, b) => b.length - a.length)
  .forEach((folder) => {
    console.log(`Removing empty folder ./${relative(ROOT_LOCATION, folder)}/`);
    removeSync(folder);
  });

console.log("All Done. Ready to build");
