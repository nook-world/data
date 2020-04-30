import { split, mapSync } from "event-stream";
import {
  createReadStream,
  existsSync,
  readFileSync,
  writeFileSync,
  writeJsonSync,
} from "fs-extra";
import { join, resolve, basename } from "path";
import { ROOT_LOCATION } from "./const";
import _ from "lodash";
import { uuid } from "./plugs/uuid";
import deepMap from "deep-map";
import { inspect } from "util";
import { isObject, isArray } from "lodash";
import traverse from "traverse";

const METAFILE_LOCATION = join(ROOT_LOCATION, "meta.jsonl");

if (!existsSync(METAFILE_LOCATION)) {
  throw new Error(`Metadata file not found. Searched at ${METAFILE_LOCATION}`);
}

const metadata = readFileSync(METAFILE_LOCATION, { encoding: "utf8" });

if (!Boolean(metadata)) {
  console.log(`${METAFILE_LOCATION} is empty. Aborting…`);
  process.exit(2);
}

const makePathsAbsolute = (settings: GeneratorSettings): GeneratorSettings => {
  const newSettings = {
    ...settings,
    source: resolve(ROOT_LOCATION, settings.source),
    output: resolve(ROOT_LOCATION, settings.output),
  };
  return newSettings;
};

export type GeneratorSettings = {
  source: string;
  output: string;
  encoding?: string;
};

const generateNewName = (oldName: string) => {
  return oldName.replace(".jsonl", "v2.jsonl");
};

const uuidMap = new Map();

const readJsonl = (filename) => {
  return readFileSync(filename, {
    encoding: "utf8",
  })
    .split("\n")
    .filter((x) => x)
    .map((x) => JSON.parse(x));
};

const generateUuid = (uuidGenFn) => (
  options: any
): [GeneratorSettings, any] => {
  const [settings, mappedData, category] = options;

  console.log({ category });
  const mappedUuid = traverse(mappedData).map((x) => {
    // if (isObject(x)) {
    //   console.log({ x });
    // }
    return x;
  });
  console.log({ mappedUuid });
  const mappedContents = mappedData.map((item) => {
    return deepMap(item, (value, key) => {
      const result = uuidGenFn(value, key, item);
      uuidMap.set(mappedData.uuid, result);
      return result;
    });
  });
  return [settings, mappedContents];
};

const generateGenericUuid = (value, key, mappedData) => {
  if (key === "uuid") {
    return uuid(value);
  }
  return value;
};

const deepMapObj = (mappedData, callbackFn) => {
  callbackFn(mappedData);
};
const replaceUuid = ([settings, mappedData]: [GeneratorSettings, any]): [
  GeneratorSettings,
  any
] => {
  return [
    settings,
    deepMap(mappedData, (value, key) => {
      if (key === "uuid" && value && value.startsWith("v1:")) {
        return uuidMap.get(value) || value;
      }
      return value;
    }),
  ];
};

const prepareData = (settings: GeneratorSettings): [GeneratorSettings, any] => {
  const mappedContents = readJsonl(settings.source);
  return [settings, mappedContents];
};

const runFor = (filename: string) => (runFn: Function) => {
  return (input: [GeneratorSettings, any]): [GeneratorSettings, any] => {
    const [settings, data] = input;
    if (settings.source.endsWith(filename)) {
      const category = basename(settings.source, ".jsonl");
      return runFn([settings, data, category]);
    }
    return [settings, data];
  };
};

const trace = (name: string) => (data: any) => {
  console.log(name, data);
  return data;
};

metadata
  .split("\n")
  .map((x) => x.trim())
  .filter((x) => Boolean(x))
  .map<GeneratorSettings>((x) => JSON.parse(x))
  .map(makePathsAbsolute)
  .map(prepareData)
  .map(runFor(".jsonl")(generateUuid(generateGenericUuid)))
  .map(replaceUuid);
// .map(([settings, items]) => {
//   return [
//     settings,
//     items.filter((item) => {
//       console.log(item.name);
//       const wzt = item.name === "Wobbling Zipper Toy";
//       const ibd = item.name === "Bunny Day";
//       return ibd || wzt;
//     }),
//   ];
// })
// .map(([settings, object]) => {
//   console.log(object);
//   if (object[0]) {
//     console.log(object[0].itemLinks);
//   } else {
//     console.log(object);
//   }
// });
// .map(([settings, object]) => {
//   const newName = generateNewName(settings.source);
//   writeJsonSync(newName, object);
// });
