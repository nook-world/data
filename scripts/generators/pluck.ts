import slufigy from "@sindresorhus/slugify";
import camelcase from "camelcase";
import { MapStream, mapSync, split, stringify, parse } from "event-stream";
import {
  createReadStream,
  createWriteStream,
  existsSync,
  readFileSync,
  ensureDirSync as ensureDir,
} from "fs-extra";
import { sync as readFolder } from "globby";
import { dirname, join, parse as parsePath, ParsedPath, resolve } from "path";
import { GeneratorSettings } from "../generator";
import { ROOT_LOCATION, DATASRC_LOCATION } from "../const";

const hasJsonFile = (pathDetails: ParsedPath) => {
  const jsonPath = join(
    DATASRC_LOCATION,
    pathDetails.dir,
    `${pathDetails.name}.json`
  );

  return existsSync(jsonPath) ? jsonPath : false;
};

const generateOutputPath = (pathDetails: ParsedPath) => {
  const outputPath = join(
    ROOT_LOCATION,
    pathDetails.dir,
    `${pathDetails.name}.js`
  );
  ensureDir(dirname(outputPath));
  return outputPath;
};

// const generateCritterOutputPath = (pathDetails: ParsedPath) => (
//   critterName: string
// ) => {
//   const outputPath = join(
//     ROOT_LOCATION,
//     pathDetails.dir,
//     `${pathDetails.name}`,
//     `${slufigy(camelcase(critterName, { pascalCase: true }), {
//       lowercase: false,
//     })}.js`
//   );
//   ensureDir(dirname(outputPath));
//   return outputPath;
// };

const pluckItemsToFile = (inputStream: MapStream, outputPath: string) => {
  return mapSync((data) => {
    if (data) {
      const critterFile = pluckName(outputPath, data);
      if (!critterFile) {
        return;
      }
      ensureDir(dirname(critterFile));
      const critterStream = createWriteStream(critterFile, {
        encoding: "utf8",
      });
      critterStream.write(`module.exports.default = ${JSON.stringify(data)};`);
      critterStream.on("finish", () => {
        console.log(`Plucked item to ${critterFile}`);
      });
      critterStream.end();
    }
  });
};

const walkPath = (obj, path) => {
  if (!path || !obj) {
    return;
  }
  return path.split(".").reduce((o, i) => {
    return o[i];
  }, obj);
};

const argumentRegex = /\{([a-zA-Z0-9._-]+)\}/;

const pluckName = (output: string, data: any) => {
  let result = output;
  const matches = [...output.matchAll(argumentRegex)];
  matches.forEach(([placeholder, path]) => {
    const dataValue = walkPath(data, path);
    if (dataValue) {
      const safeDataValue = slufigy(
        camelcase(dataValue, { pascalCase: true }),
        {
          lowercase: false,
        }
      );
      result = output.replace(placeholder, safeDataValue);
    } else {
      console.warn(
        `Couldn't find ${path} on given data. The generation will be skiped to avoid file errors`
      );
      return null;
    }
  });

  return result;
};

export const pluckGenerator = (
  generatorSettings: GeneratorSettings,
  inputStream
): MapStream =>
  inputStream
    .pipe(parse())
    .pipe(pluckItemsToFile(inputStream, generatorSettings.output));
