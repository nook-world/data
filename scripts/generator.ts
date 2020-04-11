import { split, MapStream } from "event-stream";
import {
  createReadStream,
  existsSync,
  readFileSync,
  WriteStream,
} from "fs-extra";
import { join, resolve, dirname } from "path";
import { collectionGenerator } from "./generators/collection";
import { pluckGenerator } from "./generators/pluck";
import { generateEntries } from "./generators/entry";
import globby from "globby";

export const ROOT_LOCATION = resolve(__dirname, "../");
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
  return !hasError;
};

const makePathsAbsolute = (settings: GeneratorSettings): GeneratorSettings => {
  const newSettings = {
    ...settings,
    source: resolve(ROOT_LOCATION, settings.source),
    output: resolve(ROOT_LOCATION, settings.output),
  };
  return newSettings;
};

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
};

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
