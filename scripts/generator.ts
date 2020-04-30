import { split } from "event-stream";
import { createReadStream, existsSync, readFileSync } from "fs-extra";
import { join, resolve } from "path";
import { ROOT_LOCATION } from "./const";
import { collectionGenerator } from "./generators/collection";
import { pluckGenerator } from "./generators/pluck";
import { uuid } from "./plugs/uuid";

const METAFILE_LOCATION = join(ROOT_LOCATION, "meta.jsonl");

if (!existsSync(METAFILE_LOCATION)) {
  throw new Error(`Metadata file not found. Searched at ${METAFILE_LOCATION}`);
}

const metadata = readFileSync(METAFILE_LOCATION, { encoding: "utf8" });

if (!Boolean(metadata)) {
  console.log(`${METAFILE_LOCATION} is empty. Aborting…`);
  process.exit(2);
}

const validateGeneratorSettings = (settings: GeneratorSettings): Boolean => {
  let hasError = false;
  if (!settings.source.endsWith(".jsonl")) {
    console.log(
      `${settings.source} is not a valid source. The source must be in .jsonl format`
    );
    return false;
  }
  if (!existsSync(settings.source)) {
    console.log(`Couldn't find ${settings.source}. Check your meta.jsonl file`);
    hasError = true;
  }
  if (!generators[settings.type]) {
    console.log(
      `${settings.type} is not a valid generator type. Valid type${
        Object.keys(generators).length >= 2 ? "s are" : " is"
      } '${Object.keys(generators).join("', '")}'.`
    );
    hasError = true;
  }
  if (settings.plugs && settings.plugs.length > 0) {
    const invalidPlugs = getInvalidPlugs(settings.plugs);
    if (invalidPlugs.length > 0) {
      console.log(
        `${invalidPlugs.join(" ")} ${
          invalidPlugs.length > 1 ? "are" : "is"
        } not a valid plug. Valid plug${plugsMap.size > 1 ? "s are" : " is"} ${[
          ...plugsMap.keys(),
        ].join(", ")}`
      );
      hasError = true;
    }
  }
  return !hasError;
};

const getInvalidPlugs = (plugs: PlugsString[]) => {
  return plugs.filter((plugName) => !plugsMap.has(plugName));
};

const makePathsAbsolute = (settings: GeneratorSettings): GeneratorSettings => {
  const newSettings = {
    ...settings,
    source: resolve(ROOT_LOCATION, settings.source),
    output: resolve(ROOT_LOCATION, settings.output),
  };
  return newSettings;
};

export const plugsMap = new Map();
plugsMap.set("uuid", uuid);

const generators = {
  collection: collectionGenerator,
  pluck: pluckGenerator,
};

export type GeneratorSettings = {
  source: string;
  type: keyof typeof generators;
  output: string;
  encoding?: string;
  generateEntries?: boolean;
  plugs: PlugsString[];
};

export type PlugsString = "uuid";

metadata
  .split("\n")
  .map((x) => x.trim())
  .filter((x) => Boolean(x))
  .map<GeneratorSettings>((x) => JSON.parse(x))
  .map(makePathsAbsolute)
  .filter(validateGeneratorSettings)
  .forEach((generatorSettings: GeneratorSettings) => {
    const sourceStream = createReadStream(generatorSettings.source, {
      encoding: generatorSettings.encoding || "utf8",
    });
    const fileLinesStream = sourceStream.pipe(split());
    if (generators[generatorSettings.type]) {
      generators[generatorSettings.type](generatorSettings, fileLinesStream);
    }
  });
