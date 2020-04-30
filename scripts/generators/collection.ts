import { MapStream, mapSync } from "event-stream";
import {
  createWriteStream,
  ensureDirSync as ensureDir,
  WriteStream,
} from "fs-extra";
import { dirname } from "path";
import { GeneratorSettings, plugsMap } from "../generator";

const createCrittersCollectionStream = (
  inputStream: MapStream,
  outputFile: string
) => {
  const writableStream = createWriteStream(outputFile, { encoding: "utf8" });
  writableStream.write("module.exports = [");
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
  let stream = sourceStream;
  const collectionWritableStream = createCrittersCollectionStream(
    sourceStream,
    settings.output
  );
  settings.plugs.forEach((plug) => {
    stream = stream.pipe(mapSync((data: string) => plugsMap.get(plug)(data)));
  });
  stream = stream.pipe(mapSync((data: string) => data && `${data},`));
  stream.pipe(collectionWritableStream, { end: false });

  return collectionWritableStream;
};
