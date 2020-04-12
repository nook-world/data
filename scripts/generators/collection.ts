import { MapStream, mapSync } from "event-stream";
import {
  createWriteStream,
  ensureDirSync as ensureDir,
  WriteStream,
} from "fs-extra";
import { dirname } from "path";
import { GeneratorSettings } from "../generator";

const createCrittersCollectionStream = (
  inputStream: MapStream,
  outputFile: string
) => {
  const writableStream = createWriteStream(outputFile, { encoding: "utf8" });
  writableStream.write("module.exports.default = [");
  inputStream.on("end", () => {
    writableStream.end("];");
  });
  writableStream.on("finish", () => {
    console.log(`Collection written to ${outputFile}`);
  });
  return writableStream;
};

export const collectionGenerator = (
  settings: GeneratorSettings,
  sourceStream: MapStream
): WriteStream => {
  ensureDir(dirname(settings.output));
  const collectionWritableStream = createCrittersCollectionStream(
    sourceStream,
    settings.output
  );

  sourceStream
    .pipe(mapSync((data: string) => data && `${data},`))
    .pipe(collectionWritableStream, { end: false });

  return collectionWritableStream;
};
